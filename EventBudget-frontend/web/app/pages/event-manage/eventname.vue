<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { getCurrencyLabel } from "~/shared/currencyMeta";

// ============ PAGE META ============
definePageMeta({
  layout: "header",
  title: "Event Management",
});

// ============ FORMAT HELPERS ============
const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// generic money formatter (รองรับทุกสกุล)
const formatMoney = (amount, code = "THB") => {
  if (!amount) return "0";
  const c = code.toUpperCase();
  try {
    return new Intl.NumberFormat(c === "THB" ? "th-TH" : "en-US", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${Number(amount).toFixed(2)} ${c}`;
  }
};

// ดึงชื่อสถานที่
const getVenueName = (e) =>
  e.venue_name || e.venue || e.location || e.country || "-";

// นับจำนวนทีม
const getTeamCount = (e) => {
  if (Array.isArray(e.team)) return e.team.length;
  if (typeof e.team_count === "number") return e.team_count;
  return 0;
};

// ============ API CONFIG ============
const config = useRuntimeConfig();

// Laravel events API (เชื่อมจาก .env)
const API_URL = `${config.public.apiBase}/events`;

// ExchangeRate-API (ใช้ key เดียวกับหน้า currency-manage)
const EXCHANGE_API_KEY = config.public.exchangeApiKey;
const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

// ============ LOAD EVENTS ============
const { data, refresh } = await useFetch(API_URL);

// แปลงให้เป็น array ชัวร์ ๆ (รองรับทั้ง {data:[...]} หรือ [...] ตรง ๆ)
const events = computed(() => {
  const raw = data.value;
  return (raw && (raw.data ?? raw)) || [];
});

// ============ FX STATE (live rate สำหรับแปลงงบ) ============
// 1 THB = x CODE   เช่น { USD: 0.0308, JPY: 4.82, ... }
const thbRates = ref({});
const isFxLoading = ref(false);
const fxError = ref(null);

// สกุลเงินที่ใช้ "แสดง" งบประมาณบนการ์ด (target currency)
const budgetCurrency = ref("THB");

// list สกุลทั้งหมดที่เลือกได้
const budgetCodes = computed(() => {
  const set = new Set(["THB", ...Object.keys(thbRates.value)]);
  return Array.from(set).sort();
});

// กรองสกุลเงินจากช่องค้นหา (บนหัวหน้า)
const filteredBudgetCodes = computed(() => {
  const q = budgetQuery.value.trim().toLowerCase();
  if (!q) return budgetCodes.value;
  return budgetCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || "").toLowerCase();
    return code.toLowerCase().includes(q) || label.includes(q);
  });
});

// กรองสกุลเงินสำหรับฟอร์ม event
const filteredEventCurrencyCodes = computed(() => {
  const q = eventCurrencyQuery.value.trim().toLowerCase();
  if (!q) return budgetCodes.value;
  return budgetCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || "").toLowerCase();
    return code.toLowerCase().includes(q) || label.includes(q);
  });
});

// พวกยอดนิยม เอาไว้โชว์ใน select ง่าย ๆ (optional)
const popularBudgetPreset = ["THB", "USD", "EUR", "JPY", "KRW", "CNY"];

// โหลด live rates แล้วแปลงเป็น THB base
const loadLiveRates = async () => {
  try {
    if (!EXCHANGE_API_KEY) {
      fxError.value = "ยังไม่ได้ตั้งค่า NUXT_PUBLIC_EXCHANGE_KEY";
      return;
    }

    isFxLoading.value = true;
    fxError.value = null;
    thbRates.value = {};

    const data = await $fetch(EXCHANGE_URL);
    if (data.result !== "success") throw new Error("API result not success");

    const conv = data.conversion_rates;
    const usdToThb = conv["THB"];
    if (!usdToThb) throw new Error("THB not in conversion_rates");

    const result = {};
    for (const code of Object.keys(conv)) {
      if (code === "THB") {
        result["THB"] = 1;
        continue;
      }
      // 1 USD = conv[code] CODE
      // 1 USD = usdToThb THB
      // ⇒ 1 THB = conv[code] / usdToThb CODE
      result[code] = conv[code] / usdToThb;
    }

    thbRates.value = result;
  } catch (err) {
    console.error(err);
    fxError.value = "ไม่สามารถดึง live rate สำหรับแปลงงบประมาณได้";
  } finally {
    isFxLoading.value = false;
  }
};

onMounted(() => {
  loadLiveRates();
});

// helper: per-event base currency & amount
const getEventCurrency = (e) => (e.currency_code || e.currency || "THB").toUpperCase();

const getEventBaseAmount = (e) =>
  e.base_total ?? e.total ?? e.total_budget ?? e.budget_amount ?? 0;

// helper: convert amount จาก fromCode -> toCode ด้วย thbRates
const convertAmount = (amount, fromCode, toCode) => {
  if (!amount || !fromCode || !toCode) return null;

  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();

  if (from === to) return Number(amount);

  const fromRate = from === "THB" ? 1 : thbRates.value[from];
  const toRate = to === "THB" ? 1 : thbRates.value[to];

  if (fromRate == null || toRate == null) return null;

  // from -> THB
  let amountThb;
  if (from === "THB") amountThb = Number(amount);
  else amountThb = Number(amount) / fromRate; // 1 THB = fromRate FROM ⇒ 1 FROM = 1/fromRate THB

  // THB -> to
  if (to === "THB") return amountThb;
  return amountThb * toRate;
};

// format main budget ของการ์ด (ตามสกุลเงินของ event)
const formatEventMainBudget = (event) => {
  const amount = getEventBaseAmount(event);
  const code = getEventCurrency(event);
  return formatMoney(amount, code);
};

// format งบประมาณของ event ให้เป็นสกุล budgetCurrency (เช่น THB)
const formatEventInDisplayCurrency = (event) => {
  const baseAmount = getEventBaseAmount(event);
  const baseCode = getEventCurrency(event);
  const targetCode = budgetCurrency.value;

  const converted = convertAmount(baseAmount, baseCode, targetCode);
  if (converted == null) return null;

  return formatMoney(converted, targetCode);
};

// preview ในฟอร์ม: แปลงจาก currency ของ event → budgetCurrency
const previewFormBudget = computed(() => {
  if (!newEvent.value.total) return null;
  const baseAmount = Number(newEvent.value.total);
  const baseCurrency = (newEvent.value.currency_code || "THB").toUpperCase();
  const targetCurrency = budgetCurrency.value;

  const converted = convertAmount(baseAmount, baseCurrency, targetCurrency);
  if (!converted || baseCurrency === targetCurrency) return null;

  return formatMoney(converted, targetCurrency);
});

// ============ EVENT FORM STATE ============

// เมนู 3 จุด (action menu) ต่ออีเวนต์
const openMenuId = ref(null);
const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};
const closeMenu = () => (openMenuId.value = null);

// dropdown เลือกสกุลเงิน (พร้อมค้นหา)
const isBudgetDropdownOpen = ref(false);
const budgetQuery = ref("");
const toggleBudgetDropdown = () => (isBudgetDropdownOpen.value = !isBudgetDropdownOpen.value);
const closeBudgetDropdown = () => (isBudgetDropdownOpen.value = false);
const setBudgetCurrency = (code) => {
  budgetCurrency.value = code;
  closeBudgetDropdown();
};

const isEventCurrencyDropdownOpen = ref(false);
const eventCurrencyQuery = ref("");
const toggleEventCurrencyDropdown = () => (isEventCurrencyDropdownOpen.value = !isEventCurrencyDropdownOpen.value);
const closeEventCurrencyDropdown = () => (isEventCurrencyDropdownOpen.value = false);
const setEventCurrency = (code) => {
  newEvent.value.currency_code = code;
  closeEventCurrencyDropdown();
};

const onClickOutside = (ev) => {
  const t = ev.target;
  // ปิด action menu ถ้าคลิกนอก
  if (!t.closest?.(".event-actions")) closeMenu();
  // ปิด dropdown สกุลเงิน ถ้าคลิกนอก
  if (!t.closest?.(".currency-dropdown")) closeBudgetDropdown();
  if (!t.closest?.(".event-currency-dropdown")) closeEventCurrencyDropdown();
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

const isOpen = ref(false);
const isEditing = ref(false);

// ฟังก์ชันสร้าง event ว่าง ๆ
const createEmptyEvent = () => ({
  id: null,
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  client_name: "",
  country: "",
  venue: "",
  accommodation: "",
  drive_link: "",
  total: null, // base amount ตามสกุลเงินของ event
  currency_code: "THB", // base currency ต่อ event
  venue_name: "",
  client_website: "",
  commended_name: "",
  commended_website: "",
  online_drive: "",
  team: [],
});

// ฟอร์ม
const newEvent = ref(createEmptyEvent());

// ----- HELPER map field จาก API -----
const getEventName = (e) =>
  e.name || e.event_name || e.title || "Untitled Event";

const getClientName = (e) => e.client_name || e.client || e.customer_name || "-";

const getStartDate = (e) => e.start_date || e.start || e.startDate || "";

const getEndDate = (e) => e.end_date || e.end || e.endDate || "";

// สถานะอีเวนต์ จากวันที่วันนี้เทียบกับ start/end
const getStatusInfo = (e) => {
  const startRaw = getStartDate(e);
  const endRaw = getEndDate(e);

  if (!startRaw && !endRaw) {
    return { label: "No date", bg: "bg-slate-100", text: "text-slate-500" };
  }

  const now = new Date();
  const start = startRaw ? new Date(startRaw) : null;
  const end = endRaw ? new Date(endRaw) : null;

  if (start && end && now >= start && now <= end) {
    return { label: "Ongoing", bg: "bg-blue-50", text: "text-blue-600" };
  }
  if (end && now > end) {
    return { label: "Done", bg: "bg-slate-100", text: "text-slate-600" };
  }
  return { label: "Upcoming", bg: "bg-emerald-50", text: "text-emerald-600" };
};

// (ตัวเลือก) debug ดูว่า API ส่งอะไรมา
const debugEvent = (e) => JSON.stringify(e, null, 2);

// Lock background scroll ตอนเปิด popup
watch(isOpen, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

// ============ ACTIONS ============
const openCreate = () => {
  isEditing.value = false;
  newEvent.value = createEmptyEvent();
  isOpen.value = true;
};

// กดการ์ด หรือปุ่ม ✎ เพื่อแก้ไข
const editEvent = (event) => {
  isEditing.value = true;

  newEvent.value = {
    id: event.id ?? null,

    // field หลัก
    name: event.name ?? "",
    description: event.description ?? "",
    start_date: event.start_date ?? "",
    end_date: event.end_date ?? "",
    client_name: event.client_name ?? "",

    // map จาก column ใน DB -> field ในฟอร์ม
    country: event.location ?? event.country ?? "",
    total:
      event.base_total ??
      event.total ??
      event.total_budget ??
      event.budget_amount ??
      null,
    currency_code: (event.currency_code || event.currency || "THB").toUpperCase(),

    venue_name: event.venue_name ?? "",
    client_website: event.venue_url ?? "",

    commended_name: event.accommodation_name ?? "",
    commended_website: event.accommodation_url ?? "",

    online_drive: event.drive_link ?? "",
    drive_link: event.drive_link ?? "",

    // อันที่ฟอร์มยังมีแต่ DB ไม่มีจริง ก็ปล่อยว่างไป
    venue: "",
    accommodation: "",

    team: event.team ?? [],
  };

  isOpen.value = true;
};

const closePopup = () => {
  isOpen.value = false;
};

// ลบข้อมูลจริง
const deleteEvent = async (event) => {
  if (!confirm(`ต้องการลบอีเว้นต์ "${getEventName(event)}" จริงหรือไม่?`)) return;

  try {
    await $fetch(`${API_URL}/${event.id}`, {
      method: "DELETE",
    });

    await refresh();
    alert("ลบข้อมูลสำเร็จ!");
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้");
  }
};

const addTeamMember = () => newEvent.value.team.push({ name: "" });
const removeTeamMember = (index) => newEvent.value.team.splice(index, 1);

// บันทึก (CREATE / UPDATE)
const saveEvent = async () => {
  try {
    // เตรียม payload ให้ backend (ตั้งชื่อ field ตามที่ backend ใช้จริง)
    const payload = {
      ...newEvent.value,
      base_total: newEvent.value.total,
      currency_code: (newEvent.value.currency_code || "THB").toUpperCase(),
    };

    if (isEditing.value && newEvent.value.id) {
      await $fetch(`${API_URL}/${newEvent.value.id}`, {
        method: "PUT",
        body: payload,
      });
      alert("อัปเดตข้อมูลสำเร็จ!");
    } else {
      await $fetch(API_URL, {
        method: "POST",
        body: payload,
      });
      alert("เพิ่มอีเว้นต์สำเร็จ!");
    }

    await refresh();
    closePopup();
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้");
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-[#F2F6FA] text-[#2B3856] px-3 pt-4 pb-24 sm:px-4"
  >
    <div class="mx-auto max-w-5xl">
      <!-- HEADER + budget currency selector ให้ฟีลเหมือนหน้า currency-manage -->
      <div class="mb-3 flex flex-col gap-3">
        <div
          class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-xl font-semibold text-slate-800 md:text-2xl">
              Event Management
            </h1>
            <p class="text-xs text-slate-500 md:text-sm">
              จัดการงานอีเวนต์ และงบประมาณแบบหลายสกุลเงิน (ต่ออีเวนต์) พร้อม
              live FX rate
            </p>
          </div>

          <div
            class="flex flex-col gap-1 text-[11px] text-slate-500 md:text-xs sm:items-end sm:text-right"
          >
            <span class="text-left sm:text-right">
              แสดงงบประมาณโดยประมาณเป็น
            </span>

            <!-- custom dropdown + search -->
            <div class="currency-dropdown relative w-full sm:w-auto">
              <button
                type="button"
                @click.stop="toggleBudgetDropdown"
                class="w-full sm:w-[320px] rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] md:text-xs
                       flex items-center justify-between gap-2 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              >
                <span class="truncate">
                  {{ budgetCurrency }} - {{ getCurrencyLabel(budgetCurrency) || 'Unknown currency' }}
                </span>
                <Icon name="ph:caret-down-bold" size="14" class="shrink-0" />
              </button>

              <Transition name="fade-scale">
                <div
                  v-if="isBudgetDropdownOpen"
                  class="absolute right-0 mt-2 z-30 w-full sm:w-[320px] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                >
                  <div class="p-2 border-b border-slate-100">
                    <input
                      v-model="budgetQuery"
                      type="text"
                      placeholder="Search currency..."
                      class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div class="max-h-72 overflow-auto py-1">
                    <button
                      v-for="code in filteredBudgetCodes"
                      :key="code"
                      type="button"
                      @click="setBudgetCurrency(code)"
                      class="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between gap-2"
                      :class="code === budgetCurrency ? 'bg-slate-100 font-medium' : ''"
                    >
                      <span class="truncate">{{ code }} - {{ getCurrencyLabel(code) || 'Unknown' }}</span>
                      <Icon v-if="code === budgetCurrency" name="ph:check-bold" size="12" />
                    </button>

                    <p v-if="filteredBudgetCodes.length === 0" class="px-3 py-3 text-xs text-slate-400">
                      ไม่พบสกุลเงินที่ค้นหา
                    </p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <p v-if="fxError" class="text-[11px] text-red-500">
          {{ fxError }}
        </p>
        <p v-else-if="isFxLoading" class="text-[11px] text-slate-400">
          กำลังดึง live FX rate สำหรับแปลงงบประมาณ...
        </p>
      </div>

      <!-- EVENT LIST + ANIMATION -->
      <TransitionGroup name="list-fade" tag="div">
        <div
          v-for="event in events"
          :key="event.id"
          @click="editEvent(event)"
          :class="[
            'cursor-pointer bg-white border border-[#E3EAF3] p-5 sm:p-6 rounded-2xl shadow-sm mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4',
            getStatusInfo(event).label === 'Done' ? 'opacity-50 line-through' : ''
          ]"
        >
          <!-- LEFT: ข้อมูลอีเวนต์ -->
          <div class="flex-1">
            <div class="flex items-center gap-2">
  <h2 class="text-lg sm:text-xl font-semibold text-[#2B3856]">
    {{ getEventName(event) }}
  </h2>
  <span
    v-if="getStatusInfo(event)"
    :class="`px-2 py-0.5 text-[10px] rounded-full font-medium ${getStatusInfo(event).bg} ${getStatusInfo(event).text}`"
  >
    {{ getStatusInfo(event).label }}
  </span>
</div>

            <p
              class="text-[#3A5BA0] font-medium uppercase text-xs sm:text-sm mt-1 tracking-wide"
            >
              {{ getClientName(event) }}
            </p>

            <div
              class="flex items-center gap-2 mt-3 text-[#4A5D7A] text-xs sm:text-sm"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#F47A27] animate-pulse-soft"
              ></span>
              {{ formatDate(getStartDate(event)) }} →
              {{ formatDate(getEndDate(event)) }}
            </div>

            <!-- งบประมาณ: base currency ต่ออีเวนต์ + แปลงเป็นสกุลที่เลือก -->
            <div class="mt-2 text-sm">
              <div class="text-green-600 font-semibold flex items-center gap-1">
                <span>💰</span>
                <span>
                  {{ formatEventMainBudget(event) }}
                </span>
              </div>

              <div
                v-if="budgetCurrency && budgetCurrency !== getEventCurrency(event)"
                class="mt-0.5 text-[11px] text-slate-500"
              >
                <span class="font-medium">≈</span>
                <span>
                  {{
                    formatEventInDisplayCurrency(event) ||
                      "ยังไม่มี live rate สำหรับสกุลนี้"
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- RIGHT: ปุ่ม (render เฉพาะฝั่ง client) -->
          <ClientOnly>
            <div
              class="event-actions relative flex items-center justify-end gap-2"
              @click.stop
            >
              

              <!-- ปุ่ม 3 จุด (icon-only ไม่มีกรอบ) -->
              <button
                type="button"
                class="dots-btn"
                @click.stop="toggleMenu(event.id)"
                aria-label="Event actions"
              >
                <Icon name="ph:dots-three-vertical-bold" size="20" />
              </button>

              <!-- เมนู dropdown -->
              <Transition name="fade-scale">
                <div
                  v-if="openMenuId === event.id"
                  class="absolute right-0 top-11 z-20 w-40 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                >
                  

                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    @click="editEvent(event); closeMenu()"
                  >
                    <Icon name="ph:pencil-simple-bold" size="16" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    @click="deleteEvent(event); closeMenu()"
                  >
                    <Icon name="ph:trash-bold" size="16" />
                    <span>Delete</span>
                  </button>
                </div>
              </Transition>
            </div>
          </ClientOnly>
        </div>
      </TransitionGroup>
    </div>

    <!-- ADD BUTTON -->
    <button
      @click="openCreate"
      class="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-[#F47A27] text-white rounded-full px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg shadow-lg
             flex items-center gap-2 hover:bg-[#d96b22]
             hover:-translate-y-1 hover:shadow-2xl active:scale-95
             transition-all duration-200 ease-out"
    >
      <span class="text-2xl leading-none">+</span>
      <span>Add Event</span>
    </button>

    <!-- POPUP OVERLAY + ANIMATION -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <Transition name="fade-scale">
        <div
          v-show="isOpen"
          class="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <!-- HEADER -->
          <div
            class="flex justify-between items-center px-6 py-4 border-b border-slate-200"
          >
            <h2 class="text-xl font-semibold text-slate-900">
              {{ isEditing ? "Edit Event" : "Add New Event" }}
            </h2>

            <button
              @click="closePopup"
              class="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-transform hover:rotate-90"
            >
              ✕
            </button>
          </div>

          <!-- FORM -->
          <form
            @submit.prevent="saveEvent"
            class="px-6 py-5 overflow-y-auto space-y-5"
          >
            <FormField label="Event Name">
              <input
                v-model="newEvent.name"
                class="form-input-light"
                placeholder="Enter event name"
                required
              />
            </FormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start Date">
                <input
                  v-model="newEvent.start_date"
                  type="date"
                  class="form-input-light"
                  required
                />
              </FormField>
              <FormField label="End Date">
                <input
                  v-model="newEvent.end_date"
                  type="date"
                  class="form-input-light"
                  required
                />
              </FormField>
            </div>

            <FormField label="Client">
              <input v-model="newEvent.client_name" class="form-input-light" />
            </FormField>

            <FormField label="Location">
              <input v-model="newEvent.country" class="form-input-light" />
            </FormField>

            <!-- สกุลเงินหลักของอีเวนต์ -->
            <FormField label="Event Currency">
              <div class="event-currency-dropdown relative">
                <button
                  type="button"
                  @click.stop="toggleEventCurrencyDropdown"
                  class="form-input-light flex items-center justify-between gap-2"
                >
                  <span class="truncate">
                    {{ (newEvent.currency_code || 'THB').toUpperCase() }} -
                    {{ getCurrencyLabel(newEvent.currency_code || 'THB') || 'Unknown currency' }}
                  </span>
                  <Icon name="ph:caret-down-bold" size="14" class="shrink-0" />
                </button>

                <Transition name="fade-scale">
                  <div
                    v-if="isEventCurrencyDropdownOpen"
                    class="absolute left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                  >
                    <div class="p-2 border-b border-slate-100">
                      <input
                        v-model="eventCurrencyQuery"
                        type="text"
                        placeholder="Search currency..."
                        class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div class="max-h-72 overflow-auto py-1">
                      <button
                        v-for="code in filteredEventCurrencyCodes"
                        :key="code"
                        type="button"
                        @click="setEventCurrency(code)"
                        class="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between gap-2"
                        :class="code === (newEvent.currency_code || 'THB').toUpperCase() ? 'bg-slate-100 font-medium' : ''"
                      >
                        <span class="truncate">{{ code }} - {{ getCurrencyLabel(code) || 'Unknown' }}</span>
                        <Icon v-if="code === (newEvent.currency_code || 'THB').toUpperCase()" name="ph:check-bold" size="12" />
                      </button>

                      <p v-if="filteredEventCurrencyCodes.length === 0" class="px-3 py-3 text-xs text-slate-400">
                        ไม่พบสกุลเงินที่ค้นหา
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>
            </FormField>

            <!-- งบ base + preview เป็นสกุลที่เลือกในหัวข้อ -->
            <FormField label="Total Budget (ตามสกุล Event)">
              <input
                v-model="newEvent.total"
                type="number"
                min="0"
                class="form-input-light"
                required
              />
              <p class="mt-1 text-[11px] text-slate-500">
                สกุลเงิน: {{ (newEvent.currency_code || "THB").toUpperCase() }}
              </p>
              <p
                v-if="previewFormBudget"
                class="mt-0.5 text-[11px] text-slate-500"
              >
                ≈ {{ previewFormBudget }} ({{ budgetCurrency }})
              </p>
            </FormField>

            <FormField label="Description">
              <textarea
                v-model="newEvent.description"
                rows="4"
                class="form-input-light"
              ></textarea>
            </FormField>

            <hr class="border-slate-200 my-4" />

            <h3 class="text-lg font-semibold text-slate-900">
              Event Details
            </h3>

            <FormField label="Venue Name">
              <input v-model="newEvent.venue_name" class="form-input-light" />
            </FormField>

            <FormField label="Venue Website/Map URL">
              <input
                v-model="newEvent.client_website"
                class="form-input-light"
                placeholder="https://..."
              />
            </FormField>

            <FormField label="Commended Name">
              <input
                v-model="newEvent.commended_name"
                class="form-input-light"
              />
            </FormField>

            <FormField label="Commended Website/Map URL">
              <input
                v-model="newEvent.commended_website"
                class="form-input-light"
                placeholder="https://..."
              />
            </FormField>

            <FormField label="Online Drive URL">
              <input
                v-model="newEvent.online_drive"
                class="form-input-light"
                placeholder="https://..."
              />
            </FormField>

            <hr class="border-slate-200 my-4" />

            <h3 class="text-lg font-semibold text-slate-900">
              Team Management
            </h3>

            <div
              v-for="(member, index) in newEvent.team"
              :key="index"
              class="flex items-center gap-3 mt-3"
            >
              <input
                v-model="member.name"
                class="form-input-light"
                placeholder="Team Member"
              />
              <button
                type="button"
                @click="removeTeamMember(index)"
                class="text-slate-400 hover:text-red-500 text-xl transition-transform hover:scale-110"
              >
                🗑
              </button>
            </div>

            <button
              type="button"
              @click="addTeamMember"
              class="mt-3 flex items-center gap-2 border border-orange-300 text-orange-500 px-4 py-2 rounded-lg
                     hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-sm
                     transition-all duration-150 ease-out"
            >
              <span class="text-xl leading-none">+</span> Add Team Member
            </button>

            <!-- FOOTER -->
            <div class="flex justify-end gap-2 pt-6 border-t border-slate-200">
              <button
                type="button"
                @click="closePopup"
                class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg
                       hover:bg-slate-300 hover:-translate-y-0.5
                       transition-all duration-150 ease-out"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="px-5 py-2 bg-[#F47A27] text-white rounded-lg shadow-sm
                       hover:bg-[#d96b22] hover:-translate-y-0.5 hover:shadow-md active:scale-95
                       transition-all duration-150 ease-out"
              >
                {{ isEditing ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.btn-app {
  @apply flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-150 ease-out active:scale-95;
}

.form-input-light {
  @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition;
}

/* list card animation */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.25s ease-out;
}

.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.list-fade-move {
  transition: transform 0.25s ease-out;
}

/* popup panel */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

/* จุดสีส้มกระพริบ */
@keyframes pulse-soft {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.25);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 1.8s ease-in-out infinite;
}


/* ปุ่มสามจุดให้ชัด ไม่มีกรอบ */
.dots-btn {
  @apply inline-flex items-center justify-center rounded-full p-1.5 text-slate-900 hover:bg-slate-100 active:scale-95 transition;
  color: #111827; /* ชัด ๆ เกือบดำ */
}

</style>
