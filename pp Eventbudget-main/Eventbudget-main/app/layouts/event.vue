<script setup>
import { ref, computed, onMounted } from 'vue'
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
import EventSubNav from '~/components/layout/EventSubNav.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue' // อย่าลืมตรวจสอบว่ามีไฟล์นี้
import { useEventsApi } from '~/composables/useEventsApi'
import { useRoute } from 'vue-router'

const route = useRoute()
const eventId = computed(() => route.params.id)

// --- Logic เดิมของคุณ (รักษาไว้ 100%) ---
const { events, fetchEvents } = useEventsApi()

const currentEventName = computed(() => {
  const found = events.value.find(e => e.id == eventId.value)
  return found ? found.name : 'กำลังโหลด...'
})

onMounted(() => {
  if (events.value.length === 0) {
    fetchEvents()
  }
})
// --------------------------------------

// State สำหรับ Mobile Sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value
</script>

<template>
  <div class="min-h-screen bg-base-bg text-text-primary font-sans pb-24 md:pb-0">
    
    <AppSidebar :isOpen="isSidebarOpen" @close="toggleSidebar" />

    <div class="md:pl-72 transition-all duration-300">
      
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all">
        <div class="flex flex-col">
          <div class="h-16 px-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <button @click="toggleSidebar" class="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              </button>
              
              <NuxtLink to="/" class="hidden md:flex p-2 rounded-full text-gray-400 hover:text-accent hover:bg-orange-50 transition-colors" title="กลับหน้ารายการ">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </NuxtLink>

              <div>
                <h1 class="text-lg font-bold text-gray-900 truncate leading-tight">
                  {{ currentEventName }}
                </h1>
                <p class="text-[10px] text-gray-500 font-medium hidden md:block">Event Dashboard</p>
              </div>
            </div>

            <div class="w-8 h-8 bg-orange-100 text-accent rounded-full flex items-center justify-center text-xs font-bold shadow-inner">
              EV
            </div>
          </div>

          <div class="hidden md:block px-4">
            <EventSubNav :eventId="eventId" />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)]">
        <slot />
      </main>
      
    </div>

    <EventBottomNav :eventId="eventId" />
    
    <slot name="fab" />
  </div>
</template>