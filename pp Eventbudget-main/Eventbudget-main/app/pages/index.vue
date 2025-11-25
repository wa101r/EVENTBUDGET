<script setup>
import UiIconButton from '~/components/ui/UiIconButton.vue' 
import EventCard from '~/components/event/EventCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import EventFormModal from '~/components/event/EventFormModal.vue'
import UiButton from '~/components/ui/UiButton.vue' 
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const router = useRouter()
const { events, pending, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsApi()

const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)

onMounted(() => { fetchEvents() })

const goToEventDetail = (id) => {
  if (!id) return 
  router.push(`/event/${id}`)
}

const openCreateModal = () => {
  isEditing.value = false
  selectedEvent.value = null
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  selectedEvent.value = { ...event }
  isModalOpen.value = true
}

const handleSave = async (payload) => {
  if (isEditing.value) await updateEvent(payload.id, payload)
  else await createEvent(payload)
  isModalOpen.value = false
}

const handleDelete = async (event) => {
   if (confirm(`${t.value.confirm_delete_event_msg} "${event.name}"`)) {
     await deleteEvent(event.id)
   }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.events_title }}</template>
    
    <div>
      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
      
      <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-4xl">📭</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t.no_events }}</h3>
        <p class="text-text-secondary mb-8 max-w-xs mx-auto">เริ่มสร้างอีเวนต์แรกของคุณเพื่อจัดการงบประมาณ</p>
        <UiButton variant="primary" @click="openCreateModal" class="shadow-lg shadow-accent/30">
          {{ t.create_first_event }}
        </UiButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
        <div 
          v-for="event in events" 
          :key="event.id" 
          class="group relative bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden"
        >
          <div @click="goToEventDetail(event.id)" class="flex-1 cursor-pointer p-1">
            <EventCard :event="event" class="h-full border-0 shadow-none" />
          </div>

          <div class="px-5 py-3 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex items-center justify-between mt-auto">
             <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Actions</span>
             <div class="flex items-center gap-2">
                <button 
                  @click.stop="openEditModal(event)" 
                  class="p-2 rounded-lg text-gray-400 hover:text-accent hover:bg-orange-50 transition-colors"
                  :title="t.edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
                </button>
                <button 
                  @click.stop="handleDelete(event)" 
                  class="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
                  :title="t.delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
             </div>
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
      <EventFabButton 
        @click="openCreateModal" 
        class="fixed bottom-8 right-8 shadow-xl shadow-accent/40 z-40 hover:scale-105 active:scale-95 transition-transform duration-200" 
      />
    </template>

  </NuxtLayout>
</template>