<script setup>
import { ref, onMounted, computed } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import { useTimelineApi } from '~/composables/useTimelineApi'
import { useAppLocale } from '~/composables/useAppLocale'

// Components
import TimelineEmpty from '~/components/timeline/TimelineEmpty.vue'
import TimelineDay from '~/components/timeline/TimelineDay.vue'
import DayModal from '~/components/timeline/DayModal.vue'
import ItemModal from '~/components/timeline/ItemModal.vue'

import { timelineIcons } from '~/shared/timelineIcons'

// 1. ตั้งค่า Layout (ใช้ detail ที่มี TabBar แล้ว)
definePageMeta({
  layout: "detail",
  title: "Timeline"
})

const { t } = useAppLocale()
const route = useRoute()
const eventId = computed(() => Number(route.params.id))

const {
  getTimelineByEventId,
  addDay, deleteDay,
  addItem, updateItem, deleteItem
} = useTimelineApi()

// 2. ดึงข้อมูล (ใส่ await เพื่อรอข้อมูล)
const { data: timelineData, refresh } = await getTimelineByEventId(eventId.value)
// 3. สร้าง Computed เพื่อป้องกัน null (ถ้าไม่มีข้อมูลให้เป็น array ว่าง)
const timelineList = computed(() => timelineData.value || [])
// open/close days
const openDays = ref([])
const toggleDay = (dayId) => {
  openDays.value = openDays.value.includes(dayId)
    ? openDays.value.filter(id => id !== dayId)
    : [...openDays.value, dayId]
}

onMounted(() => {
  if (timelineList.value.length > 0) {
    openDays.value = timelineList.value.map(d => d.id)
  }
})

// modals state
const isDayModalOpen = ref(false)
const dayForm = ref({ date: '', title: '' })

const isModalOpen = ref(false)
const isEditing = ref(false)
const activeDayId = ref(null)
const form = ref({
  id: null,
  start_time: '',
  end_time: '',
  title: '',
  description: '',
  location: '',
  icon: '📍'
})

// --- ACTIONS ---
const openAddDay = () => {
  dayForm.value = { date: '', title: '' }
  isDayModalOpen.value = true
}

const handleSaveDay = async () => {
  if (!dayForm.value.date || !dayForm.value.title) {
    return alert(t.value.warning_fill_all || 'กรุณากรอกข้อมูลให้ครบ')
  }

  await addDay({
    event_id: eventId.value,
    date: dayForm.value.date,
    title: dayForm.value.title
  })

  // Refresh ข้อมูลหลังบันทึก (ถ้าใช้ useFetch มันจะ auto refresh ให้ถ้าระบบ reactive ถูกต้อง)
  // แต่ถ้าไม่ refresh ให้ลองเรียก refresh() จาก useFetch หรือ reload หน้า
  // window.location.reload() // แบบบ้านๆ แก้ขัดไปก่อน
  await refresh()
  isDayModalOpen.value = false
}

const handleDeleteDay = async (dayId) => {
  if (confirm(t.value.confirm_delete_day_msg || 'ลบวันนี้?')) {
    await deleteDay(dayId)
    await refresh()
    // window.location.reload()
  }
}

const openCreateItem = (dayId) => {
  isEditing.value = false
  activeDayId.value = dayId
  form.value = { id: null, start_time: '', end_time: '', title: '', description: '', location: '', icon: '📍' }
  isModalOpen.value = true
}

const openEditItem = (dayId, item) => {
  isEditing.value = true
  activeDayId.value = dayId
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSaveItem = async () => {
  if (!form.value.title || !form.value.start_time) {
    return alert(t.value.warning_fill_all || 'กรุณากรอกข้อมูลให้ครบ')
  }
  const payload = { ...form.value }

  if (isEditing.value) {
    await updateItem(activeDayId.value, payload)
  } else {
    await addItem(activeDayId.value, payload)
  }

  await refresh()
  isModalOpen.value = false
}

const handleDeleteItem = async (dayId, itemId) => {
  if (confirm(t.value.confirm_delete_activity_msg || 'ลบกิจกรรมนี้?')) {
    await deleteItem(dayId, itemId)
    await refresh()
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 pb-24">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ t.timeline_title || 'กำหนดการ' }}
        </h2>
        <p class="text-gray-500 mt-1 text-sm">{{ t.timeline_subtitle || 'จัดการลำดับกิจกรรมแบบเรียลไทม์' }}</p>
      </div>

      <button type="button" @click="openAddDay"
        class="bg-[#F47A27] text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#d96b22] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-semibold">
        <span class="text-lg leading-none">+</span>
        <span>{{ t.add_day || 'เพิ่มวัน' }}</span>
      </button>
    </div>

    <TimelineEmpty v-if="timelineList.length === 0" :t="t" @addDay="openAddDay" />

    <div v-else class="space-y-6">
      <TimelineDay v-for="day in timelineList" :key="day.id" :day="day" :t="t" :isOpen="openDays.includes(day.id)"
        @toggle="toggleDay(day.id)" @addItem="openCreateItem(day.id)" @deleteDay="handleDeleteDay(day.id)"
        @editItem="item => openEditItem(day.id, item)" @deleteItem="itemId => handleDeleteItem(day.id, itemId)" />
    </div>

    <DayModal :open="isDayModalOpen" :form="dayForm" :t="t" @update:form="v => (dayForm = v)"
      @close="isDayModalOpen = false" @save="handleSaveDay" />

    <ItemModal :open="isModalOpen" :form="form" :isEditing="isEditing" :availableIcons="timelineIcons" :t="t"
      @update:form="v => (form = v)" @close="isModalOpen = false" @save="handleSaveItem" />
  </div>

</template>