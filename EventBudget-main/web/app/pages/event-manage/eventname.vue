<script setup>
import { ref, watch, computed } from "vue";

definePageMeta({
  layout: "header",
  title: "Event Management",
});


const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short", // short = Dec
    year: "numeric",
  });
};

// แปลงเงิน
const formatMoney = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });
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


const config = useRuntimeConfig();

// ฝั่ง server ใช้อันนี้
const BASE_URL = process.server
  ? config.API_URL_INTERNAL       
  : config.public.API_URL;         

const API_URL = BASE_URL + "/api/events";

const { data, refresh } = await useFetch(API_URL);


// แปลงให้เป็น array ชัวร์ ๆ (รองรับทั้ง {data:[...]} หรือ [...] ตรง ๆ)
const events = computed(() => {
  const raw = data.value;
  return (raw && (raw.data ?? raw)) || [];
});

// ----- STATE -----
const isOpen = ref(false);
const isEditing = ref(false);

const createEmptyEvent = () => ({
  id: null,
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  client_name: "",
  location: "",
  venue_name: "",
  venue_url: "",
  accommodation_name: "",
  accommodation_url: "",
  drive_link: "",
  total_budget: null,
});

// ฟอร์ม
const newEvent = ref(createEmptyEvent());

// ----- HELPER เอาไว้ map ชื่อ field จาก API -----
const getEventName = (e) =>
  e.name || e.event_name || e.title || "Untitled Event";

const getClientName = (e) =>
  e.client_name || e.client || e.customer_name || "-";

const getStartDate = (e) =>
  e.start_date || e.start || e.startDate || "-";

const getEndDate = (e) =>
  e.end_date || e.end || e.endDate || "-";

// (ตัวเลือก) debug ดูว่า API ส่งอะไรมา
const debugEvent = (e) => JSON.stringify(e, null, 2);



// Lock background scroll ตอนเปิด popup
watch(isOpen, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

// ----- ACTIONS -----
const openCreate = () => {
  isEditing.value = false;
  newEvent.value = createEmptyEvent();
  isOpen.value = true;
};

// กดการ์ด หรือปุ่ม ✎ เพื่อแก้ไข
const editEvent = (event) => {
  isEditing.value = true;

  newEvent.value = {
  id: event.id,
  name: event.name,
  description: event.description,
  start_date: event.start_date,
  end_date: event.end_date,
  client_name: event.client_name,
  location: event.location,
  venue_name: event.venue_name,
  venue_url: event.venue_url,
  accommodation_name: event.accommodation_name,
  accommodation_url: event.accommodation_url,
  drive_link: event.drive_link,
  total_budget: event.total_budget,
};

  isOpen.value = true;
};


const closePopup = () => {
  isOpen.value = false;
};

// ลบข้อมูลจริง
const deleteEvent = async (event) => {
  if (!confirm(`ต้องการลบอีเว้นต์ "${event.name}" จริงหรือไม่?`)) return;

  try {
    await $fetch(`${API_URL}/${event.id}`, {
      method: "DELETE",
    });

    await refresh(); // โหลดรายการใหม่
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
    if (isEditing.value) {
      await $fetch(`${API_URL}/${newEvent.value.id}`, {
        method: "PUT",
        body: newEvent.value,
      });
    } else {
      await $fetch(API_URL, {
        method: "POST",
        body: newEvent.value,
      });
    }
    await refresh();
    closePopup();
  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("บันทึกข้อมูลไม่สำเร็จ (ดู Console)");
  }
};


</script>

<template>
  <div class="p-4 min-h-screen bg-[#F2F6FA] text-[#2B3856]">
    <!-- EVENT LIST + ANIMATION -->
    <TransitionGroup name="list-fade" tag="div">
      <div
        v-for="event in events"
        :key="event.id"
        @click="editEvent(event)"
        class="cursor-pointer bg-white border border-[#E3EAF3] p-6 rounded-xl shadow-sm mt-4 flex justify-between
               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out"
      >
        <div>
          <h2 class="text-xl font-semibold text-[#2B3856]">
            {{ getEventName(event) }}
          </h2>
          <p class="text-[#3A5BA0] font-medium uppercase text-sm mt-1 tracking-wide">
            {{ getClientName(event) }}
          </p>

          <div class="flex items-center gap-2 mt-3 text-[#4A5D7A] text-sm">
            <span class="w-2 h-2 rounded-full bg-[#F47A27] animate-pulse-soft"></span>
            {{ formatDate(getStartDate(event)) }} → {{ formatDate(getEndDate(event)) }}
          </div>

          <div class="mt-2 text-green-600 font-semibold text-sm flex items-center gap-1">
            <span>💰</span>
            {{ formatMoney(event.total || event.total_budget) }}
          </div>
        </div>

        <!-- RIGHT: ปุ่มแบบแอพ -->
        <div class="flex items-center gap-2 mt-4 sm:mt-0 self-start sm:self-end">
          <!-- DONE / CHECK -->
          <button @click.stop class="action-btn action-btn-done">
            ✓
          </button>

          <!-- EDIT -->
          <button @click.stop="editEvent(event)" class="action-btn action-btn-edit">
            ✎
          </button>

          <!-- DELETE -->
          <button @click.stop="deleteEvent(event)" class="action-btn action-btn-delete">
            🗑
          </button>
        </div>
      </div>
    </TransitionGroup>

    <!-- ADD BUTTON -->
    <button
      @click="openCreate"
      class="fixed bottom-6 right-6 bg-[#F47A27] text-white rounded-full px-6 py-3 text-lg shadow-lg
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
          <div class="flex justify-between items-center px-6 py-4 border-b border-slate-200">
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
          <form @submit.prevent="saveEvent" class="px-6 py-5 overflow-y-auto space-y-5">
            <FormField label="Event Name">
              <input v-model="newEvent.name" class="form-input-light" placeholder="Enter event name" required />
            </FormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start Date">
                <input v-model="newEvent.start_date" type="date" class="form-input-light" required />
              </FormField>
              <FormField label="End Date">
                <input v-model="newEvent.end_date" type="date" class="form-input-light" required />
              </FormField>
            </div>

            <FormField label="Client">
              <input v-model="newEvent.client_name" class="form-input-light" required />
            </FormField>

            <FormField label="Location">
              <input v-model="newEvent.country" class="form-input-light" required />
            </FormField>

            <FormField label="Total Budget (THB)">
              <input v-model="newEvent.total" type="number" class="form-input-light" required />
            </FormField>

            <FormField label="Description">
              <textarea v-model="newEvent.description" rows="4" class="form-input-light" required></textarea>
            </FormField>

            <hr class="border-slate-200 my-4" />

            <h3 class="text-lg font-semibold text-slate-900">Event Details</h3>

            <FormField label="Venue Name">
              <input v-model="newEvent.venue_name" class="form-input-light" required />
            </FormField>

            <FormField label="Venue Website/Map URL">
              <input v-model="newEvent.client_website" class="form-input-light" required placeholder="https://..." />
            </FormField>

            <FormField label="Commended Name">
              <input v-model="newEvent.commended_name" class="form-input-light" required />
            </FormField>

            <FormField label="Commended Website/Map URL">
              <input v-model="newEvent.commended_website" class="form-input-light" required placeholder="https://..." />
            </FormField>

            <FormField label="Online Drive URL">
              <input v-model="newEvent.online_drive" class="form-input-light" required placeholder="https://..." />
            </FormField>

            <hr class="border-slate-200 my-4" />

            <h3 class="text-lg font-semibold text-slate-900">Team Management</h3>

            <div
              v-for="(member, index) in newEvent.team"
              :key="index"
              class="flex items-center gap-3 mt-3"
            >
              <input v-model="member.name" class="form-input-light" placeholder="Team Member" required />
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
.form-input-light {
  @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition;
}

/* ✨ list card animation เวลาโหลด / เพิ่ม / ลบ */
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

/* ✨ popup panel scale + fade */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

/* ✨ จุดสีส้มกระพริบเบา ๆ (timeline dot) */
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
.action-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
  shadow-sm hover:shadow-md transition-all duration-150 ease-out
  active:scale-95;
}

/* ปุ่มติ๊กถูก */
.action-btn-done {
  @apply bg-[#ECE8FF] text-[#6558F5] border border-[#C9BFFF]
  hover:bg-[#6558F5] hover:text-white;
}

/* ปุ่มแก้ไข */
.action-btn-edit {
  @apply bg-[#E7F0FF] text-[#2357C6] border border-[#C4D9FF]
  hover:bg-[#2357C6] hover:text-white;
}

/* ปุ่มลบ */
.action-btn-delete {
  @apply bg-[#FFE9E9] text-[#E04848] border border-[#FFC7C7]
  hover:bg-[#E04848] hover:text-white;
}

</style>