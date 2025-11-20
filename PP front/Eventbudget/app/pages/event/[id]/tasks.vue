<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useEventDetailsApi } from '~/composables/useEventDetailsApi'

const route = useRoute()
const eventId = route.params.id
const { getTasksByEvent, createTask, toggleTask, deleteTask } = useEventDetailsApi()

const tasks = getTasksByEvent(eventId)
const isModalOpen = ref(false)
const form = ref({ title: '', description: '', due_date: '' })

const openCreate = () => { form.value = { title: '', description: '', due_date: '' }; isModalOpen.value = true }
const handleSave = () => { createTask({ ...form.value, event_id: eventId }); isModalOpen.value = false }
const handleDelete = (id) => { if(confirm('ลบงานนี้?')) deleteTask(id) }
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-3xl mx-auto py-2">
      <h2 class="text-2xl font-bold text-text-primary mb-6">สิ่งที่ต้องทำ</h2>

      <div v-if="tasks.length === 0" class="text-center text-gray-400 py-20 bg-white rounded-xl border border-dashed">
        <p>ไม่มีงานค้าง สบายจัง!</p>
        <UiButton variant="primary" @click="openCreate" class="mt-3">สร้างงานใหม่</UiButton>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="bg-white p-4 rounded-xl border border-base-border shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
          :class="{'opacity-60 bg-gray-50': task.is_completed}"
        >
          <div class="pt-1">
            <input 
              type="checkbox" 
              :checked="task.is_completed" 
              @change="toggleTask(task.id)" 
              class="w-6 h-6 rounded-md border-2 border-gray-300 text-accent focus:ring-accent cursor-pointer"
            />
          </div>
          
          <div class="flex-1">
            <h4 
              class="text-lg font-bold text-gray-800 transition-all"
              :class="{'line-through text-gray-400': task.is_completed}"
            >
              {{ task.title }}
            </h4>
            <p class="text-sm text-gray-500">{{ task.description }}</p>
            <div v-if="task.due_date" class="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" :class="task.is_completed ? 'bg-gray-200 text-gray-500' : 'bg-orange-50 text-accent'">
              📅 ครบกำหนด: {{ task.due_date }}
            </div>
          </div>

          <button @click="handleDelete(task.id)" class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <template #fab><EventFabButton @click="openCreate" class="fixed bottom-24 right-8" /></template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl p-6 space-y-4 shadow-xl">
        <h3 class="text-xl font-bold">เพิ่มงานใหม่</h3>
        <UiInput v-model="form.title" label="ชื่องาน" />
        <UiInput v-model="form.description" label="รายละเอียด" />
        <UiInput v-model="form.due_date" label="วันครบกำหนด" type="date" />
        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">บันทึก</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>