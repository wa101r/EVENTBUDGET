<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useEventDetailsApi } from '~/composables/useEventDetailsApi'

const route = useRoute()
const eventId = route.params.id
const { getTimelineByEvent, createTimelineItem, deleteTimelineItem } = useEventDetailsApi()

const timelineGroups = getTimelineByEvent(eventId)
const isModalOpen = ref(false)
const form = ref({ title: '', description: '', date: '', start_time: '', end_time: '' })

const openCreate = () => {
  form.value = { title: '', description: '', date: '', start_time: '', end_time: '' }
  isModalOpen.value = true
}
const handleSave = () => { createTimelineItem({ ...form.value, event_id: eventId }); isModalOpen.value = false }
const handleDelete = (id) => { if(confirm('ลบ?')) deleteTimelineItem(id) }
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-3xl mx-auto py-2">
      <h2 class="text-2xl font-bold text-text-primary mb-6">กำหนดการ (Timeline)</h2>

      <div v-if="Object.keys(timelineGroups).length === 0" class="text-center text-gray-400 py-20 bg-white rounded-xl border border-dashed">
        <p>ยังไม่มีกำหนดการ</p>
        <UiButton variant="primary" @click="openCreate" class="mt-3">เพิ่มกำหนดการแรก</UiButton>
      </div>

      <div v-else class="space-y-8 relative">
        <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

        <div v-for="(items, date) in timelineGroups" :key="date" class="relative">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 rounded-full bg-accent border-4 border-white shadow flex items-center justify-center z-10">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span class="ml-4 text-lg font-bold text-text-primary bg-gray-100 px-3 py-1 rounded-md">{{ date }}</span>
          </div>

          <div class="pl-12 space-y-4">
            <div v-for="item in items" :key="item.id" class="bg-white p-4 rounded-xl border border-base-border shadow-sm hover:shadow-md transition-all relative group">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <div class="flex items-center gap-2 text-accent font-bold text-sm mb-1">
                    <span>🕒 {{ item.start_time }} - {{ item.end_time }}</span>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-800">{{ item.title }}</h4>
                  <p class="text-gray-500 text-sm mt-1">{{ item.description }}</p>
                </div>
                <button @click="handleDelete(item.id)" class="text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute top-3 right-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #fab><EventFabButton @click="openCreate" class="fixed bottom-24 right-8" /></template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl p-6 space-y-4 shadow-xl">
        <h3 class="text-xl font-bold">เพิ่มกำหนดการ</h3>
        <UiInput v-model="form.title" label="หัวข้อกิจกรรม" />
        <UiInput v-model="form.description" label="รายละเอียด" />
        <UiInput v-model="form.date" label="วันที่" type="date" />
        <div class="grid grid-cols-2 gap-4">
          <UiInput v-model="form.start_time" label="เริ่ม" type="time" />
          <UiInput v-model="form.end_time" label="สิ้นสุด" type="time" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">บันทึก</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>