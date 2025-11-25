<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { getCurrencyLabel } from "~/shared/currencyMeta";

import EventHeaderBar from "~/components/event/EventHeaderBar.vue";
import EventCard from "~/components/event/EventCard.vue";
import EventFormModal from "~/components/event/EventFormModal.vue";

import {
  formatMoney,
  getEventCurrency,
  getEventBaseAmount,
  convertAmount,
} from "~/shared/eventHelpers";

definePageMeta({
  layout: "header",
  title: "Event Management",
});

const router = useRouter();
const openEvent = (id) => router.push(`/event-manage/${id}`);

// ============ API CONFIG ============
const config = useRuntimeConfig();
const API_URL = `${config.public.apiBase}/events`;
const EXCHANGE_API_KEY = config.public.exchangeApiKey;
const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

// ============ LOAD EVENTS ============
const { data, refresh } = await useFetch(API_URL);
const events = computed(() => {
  const raw = data.value;
  return (raw && (raw.data ?? raw)) || [];
});

// ============ FX STATE ============
const thbRates = ref({});
const isFxLoading = ref(false);
const fxError = ref(null);

const budgetCurrency = ref("THB");
const budgetQuery = ref("");
const isBudgetDropdownOpen = ref(false);

const budgetCodes = computed(() => {
  const set = new Set(["THB", ...Object.keys(thbRates.value)]);
  return Array.from(set).sort();
});

const filteredBudgetCodes = computed(() => {
  const q = budgetQuery.value.trim().toLowerCase();
  if (!q) return budgetCodes.value;
  return budgetCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || "").toLowerCase();
    return code.toLowerCase().includes(q) || label.includes(q);
  });
});

const toggleBudgetDropdown = () =>
  (isBudgetDropdownOpen.value = !isBudgetDropdownOpen.value);
const closeBudgetDropdown = () => (isBudgetDropdownOpen.value = false);
const setBudgetCurrency = (code) => {
  budgetCurrency.value = code;
  closeBudgetDropdown();
};

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

onMounted(loadLiveRates);

// ============ FORM STATE ============
const isOpen = ref(false);
const isEditing = ref(false);

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
  total: null,
  currency_code: "THB",
  venue_name: "",
  client_website: "",
  commended_name: "",
  commended_website: "",
  online_drive: "",
  team: [],
});

const newEvent = ref(createEmptyEvent());

// dropdown currency for form
const isEventCurrencyDropdownOpen = ref(false);
const eventCurrencyQuery = ref("");

const filteredEventCurrencyCodes = computed(() => {
  const q = eventCurrencyQuery.value.trim().toLowerCase();
  if (!q) return budgetCodes.value;
  return budgetCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || "").toLowerCase();
    return code.toLowerCase().includes(q) || label.includes(q);
  });
});

const toggleEventCurrencyDropdown = () =>
  (isEventCurrencyDropdownOpen.value = !isEventCurrencyDropdownOpen.value);
const closeEventCurrencyDropdown = () =>
  (isEventCurrencyDropdownOpen.value = false);
const setEventCurrency = (code) => {
  newEvent.value.currency_code = code;
  closeEventCurrencyDropdown();
};

const onClickOutside = (ev) => {
  const t = ev.target;
  if (!t.closest?.(".currency-dropdown")) closeBudgetDropdown();
  if (!t.closest?.(".event-currency-dropdown")) closeEventCurrencyDropdown();
};

onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));

watch(isOpen, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

// preview ในฟอร์ม: แปลงจาก currency ของ event → budgetCurrency
const previewFormBudget = computed(() => {
  if (!newEvent.value.total) return null;
  const baseAmount = Number(newEvent.value.total);
  const baseCurrency = (newEvent.value.currency_code || "THB").toUpperCase();
  const targetCurrency = budgetCurrency.value;

  const converted = convertAmount(baseAmount, baseCurrency, targetCurrency, thbRates.value);
  if (!converted || baseCurrency === targetCurrency) return null;
  return formatMoney(converted, targetCurrency);
});

// actions
const openCreate = () => {
  isEditing.value = false;
  newEvent.value = createEmptyEvent();
  isOpen.value = true;
};

const editEvent = (event) => {
  isEditing.value = true;
  newEvent.value = {
    id: event.id ?? null,
    name: event.name ?? "",
    description: event.description ?? "",
    start_date: event.start_date ?? "",
    end_date: event.end_date ?? "",
    client_name: event.client_name ?? "",
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
    venue: "",
    accommodation: "",
    team: event.team ?? [],
  };
  isOpen.value = true;
};

const deleteEvent = async (event) => {
  if (!confirm(`ต้องการลบอีเว้นต์ "${event.name}" จริงหรือไม่?`)) return;
  try {
    await $fetch(`${API_URL}/${event.id}`, { method: "DELETE" });
    await refresh();
    alert("ลบข้อมูลสำเร็จ!");
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้");
  }
};

const addTeamMember = () => newEvent.value.team.push({ name: "" });
const removeTeamMember = (index) => newEvent.value.team.splice(index, 1);

const saveEvent = async () => {
  try {
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
      await $fetch(API_URL, { method: "POST", body: payload });
      alert("เพิ่มอีเว้นต์สำเร็จ!");
    }

    await refresh();
    isOpen.value = false;
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้");
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F2F6FA] text-[#2B3856] px-3 pt-4 pb-24 sm:px-4">
    <div class="mx-auto max-w-5xl">
      <!-- HEADER -->
      <EventHeaderBar
        :budget-currency="budgetCurrency"
        :budget-query="budgetQuery"
        :is-budget-dropdown-open="isBudgetDropdownOpen"
        :filtered-budget-codes="filteredBudgetCodes"
        :is-fx-loading="isFxLoading"
        :fx-error="fxError"
        @toggleBudgetDropdown="toggleBudgetDropdown"
        @setBudgetCurrency="setBudgetCurrency"
        @update:budgetQuery="v => (budgetQuery = v)"
      />

      <!-- EVENT LIST -->
      <TransitionGroup name="list-fade" tag="div">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          :budget-currency="budgetCurrency"
          :thb-rates="thbRates"
          @open="openEvent(event.id)"
          @edit="editEvent(event)"
          @delete="deleteEvent(event)"
        />
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

    <!-- FORM MODAL -->
    <EventFormModal
      v-model="isOpen"
      :is-editing="isEditing"
      :new-event="newEvent"
      :preview-form-budget="previewFormBudget"
      :budget-currency="budgetCurrency"
      :is-event-currency-dropdown-open="isEventCurrencyDropdownOpen"
      :event-currency-query="eventCurrencyQuery"
      :filtered-event-currency-codes="filteredEventCurrencyCodes"
      @toggleEventCurrencyDropdown="toggleEventCurrencyDropdown"
      @setEventCurrency="setEventCurrency"
      @update:eventCurrencyQuery="v => (eventCurrencyQuery = v)"
      @addTeamMember="addTeamMember"
      @removeTeamMember="removeTeamMember"
      @save="saveEvent"
    />
  </div>
</template>

<style>
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
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
.animate-pulse-soft {
  animation: pulse-soft 1.8s ease-in-out infinite;
}
</style>
