<script setup>
import { ref, onMounted, computed } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import { useTimelineApi } from '~/composables/useTimelineApi'
import { useAppLocale } from '~/composables/useAppLocale'
import EventTabBar from '~/components/layout/EventTabBar.vue'

import TimelineEmpty from '~/components/timeline/TimelineEmpty.vue'
import TimelineDay from '~/components/timeline/TimelineDay.vue'
import DayModal from '~/components/timeline/DayModal.vue'
import ItemModal from '~/components/timeline/ItemModal.vue'

import { timelineIcons } from '~/shared/timelineIcons'

definePageMeta({
  layout: "header",
  title: 'Timeline'
})

const { t } = useAppLocale()
const route = useRoute()
const eventId = computed(() => Number(route.params.id))

const {
  getTimelineByEventId,
  addDay, deleteDay,
  addItem, updateItem, deleteItem
} = useTimelineApi()

const timelineData = getTimelineByEventId(eventId.value)

// open/close days
const openDays = ref([])
const toggleDay = (dayId) => {
  openDays.value = openDays.value.includes(dayId)
    ? openDays.value.filter(id => id !== dayId)
    : [...openDays.value, dayId]
}

onMounted(() => {
  if (timelineData.value.length > 0) {
    openDays.value = timelineData.value.map(d => d.id)
  }
})

// modals
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

// day actions
const openAddDay = () => {
  dayForm.value = { date: '', title: '' }
  isDayModalOpen.value = true
}

const handleSaveDay = () => {
  if (!dayForm.value.date || !dayForm.value.title) {
    return alert(t.value.warning_fill_all)
  }

  addDay({
    event_id: eventId.value,
    date: dayForm.value.date,
    title: dayForm.value.title
  })

  setTimeout(() => {
    const newDay = timelineData.value[timelineData.value.length - 1]
    if (newDay) openDays.value.push(newDay.id)
  }, 100)

  isDayModalOpen.value = false
}

const handleDeleteDay = (dayId) => {
  if(confirm(t.value.confirm_delete_day_msg)) deleteDay(dayId)
}

// item actions
const openCreateItem = (dayId) => {
  isEditing.value = false
  activeDayId.value = dayId
  form.value = {
    id: null,
    start_time: '',
    end_time: '',
    title: '',
    description: '',
    location: '',
    icon: '📍'
  }
  isModalOpen.value = true
}

const openEditItem = (dayId, item) => {
  isEditing.value = true
  activeDayId.value = dayId
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSaveItem = () => {
  if (!form.value.title || !form.value.start_time) {
    return alert(t.value.warning_fill_all)
  }
  const payload = { ...form.value }
  isEditing.value
    ? updateItem(activeDayId.value, payload)
    : addItem(activeDayId.value, payload)

  isModalOpen.value = false
}

const handleDeleteItem = (dayId, itemId) => {
  if(confirm(t.value.confirm_delete_activity_msg)) deleteItem(dayId, itemId)
}
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            {{ t.timeline_title }}
          </h2>
          <p class="text-gray-500 mt-1 text-sm">{{ t.timeline_subtitle }}</p>
        </div>
        <UiButton variant="primary" @click="openAddDay" class="shadow-lg hover:shadow-xl transition-shadow">
          <span class="mr-2 text-lg">+</span> {{ t.add_day }}
        </UiButton>
      </div>

      <!-- Empty -->
      <TimelineEmpty
        v-if="timelineData.length === 0"
        :t="t"
        @addDay="openAddDay"
      />

      <!-- Days -->
      <TimelineDay
        v-for="day in timelineData"
        :key="day.id"
        :day="day"
        :t="t"
        :isOpen="openDays.includes(day.id)"
        @toggle="toggleDay(day.id)"
        @addItem="openCreateItem(day.id)"
        @deleteDay="handleDeleteDay(day.id)"
        @editItem="item => openEditItem(day.id, item)"
        @deleteItem="itemId => handleDeleteItem(day.id, itemId)"
      />
    </div>

    <!-- Modals -->
    <DayModal
      :open="isDayModalOpen"
      :form="dayForm"
      :t="t"
      @update:form="v => (dayForm = v)"
      @close="isDayModalOpen = false"
      @save="handleSaveDay"
    />

    <ItemModal
      :open="isModalOpen"
      :form="form"
      :isEditing="isEditing"
      :availableIcons="timelineIcons"
      :t="t"
      @update:form="v => (form = v)"
      @close="isModalOpen = false"
      @save="handleSaveItem"
    />
  </NuxtLayout>

  <!-- Tab bar -->
  <EventTabBar :event-id="eventId" />
</template>
