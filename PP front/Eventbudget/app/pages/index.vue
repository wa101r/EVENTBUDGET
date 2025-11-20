<script setup>
import UiIconButton from '~/components/ui/UiIconButton.vue' 
import EventCard from '~/components/event/EventCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import EventFormModal from '~/components/event/EventFormModal.vue'
import UiButton from '~/components/ui/UiButton.vue' 

const { events, pending, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)

onMounted(() => { fetchEvents() })

const openCreateModal = () => {
  isEditing.value = false
  // ⭐️ Reset ค่าทุก Field ให้ตรงกับ DB (กัน error เวลา v-model)
  selectedEvent.value = { 
    id: null, 
    name: '', 
    description: '', 
    start_date: '', 
    end_date: '',
    client_name: '', 
    location: '', 
    total_budget: null, 
    venue_name: '',
    venue_url: '', 
    accommodation_name: '', 
    accommodation_url: '', 
    drive_link: ''
  }
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  // Clone object เพื่อไม่ให้แก้ข้อมูลใน List โดยตรงก่อนบันทึก
  selectedEvent.value = { ...event }
  isModalOpen.value = true
}

const handleSave = async (payload) => {
  if (isEditing.value) {
    await updateEvent(payload.id, payload)
  } else {
    const createData = { ...payload }
    delete createData.id // ลบ ID ทิ้งเพื่อให้ Backend/Composable สร้างให้
    await createEvent(createData)
  }
  isModalOpen.value = false
}

const handleDelete = async (event) => {
   if (confirm(`ต้องการลบอีเว้นต์ "${event.name}" จริงหรือไม่?`)) {
     await deleteEvent(event.id)
   }
}
</script>

<template>
  <NuxtLayout name="default">
    
    <template #header-title>จัดการอีเวนต์</template>
    
    <div>
      <div v-if="pending" class="text-text-secondary p-4">กำลังโหลด...</div>
      
      <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-16 text-text-secondary">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-lg mb-4">ยังไม่มีอีเวนต์ในระบบ</p>
        <UiButton variant="primary" @click="openCreateModal">
          สร้างอีเวนต์แรก
        </UiButton>
      </div>

      <div v-else class="space-y-4 pb-20">
        <div v-for="event in events" :key="event.id" class="flex items-start gap-3 animate-fade-in-up">
          
          <NuxtLink :to="`/event/${event.id}`" class="flex-1 min-w-0 block decoration-0">
            <EventCard :event="event" />
          </NuxtLink>
          
          <div class="flex flex-col gap-2 pt-1">
            <UiIconButton variant="secondary" @click="openEditModal(event)" title="แก้ไข">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
            </UiIconButton>
            
            <UiIconButton variant="danger" @click="handleDelete(event)" title="ลบ">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </UiIconButton>
          </div>

        </div>
      </div>
      
      <EventFormModal 
        :show="isModalOpen" 
        :event="selectedEvent"
        :isEditing="isEditing"
        @close="isModalOpen = false" 
        @save="handleSave"
      />
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreateModal" class="fixed bottom-8 right-8 shadow-lg z-50" />
    </template>

  </NuxtLayout>
</template>

<style scoped>
/* Animation เล็กน้อยให้ดูนุ่มนวล */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>