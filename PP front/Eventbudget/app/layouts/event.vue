<script setup>
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
// 1. นำเข้า Composable เพื่อดึงข้อมูล
import { useEventsApi } from '~/composables/useEventsApi'

const route = useRoute()
const eventId = route.params.id

// 2. ดึง state 'events' และฟังก์ชัน 'fetchEvents' มาใช้
const { events, fetchEvents } = useEventsApi()

// 3. ใช้ computed เพื่อค้นหาชื่ออีเวนต์จาก ID โดยอัตโนมัติ
const currentEventName = computed(() => {
  const found = events.value.find(e => e.id == eventId)
  return found ? found.name : 'กำลังโหลด...'
})

// 4. ป้องกันกรณี Refresh หน้าแล้วข้อมูลหาย (สั่งให้โหลดใหม่ถ้าไม่มีข้อมูล)
onMounted(() => {
  if (events.value.length === 0) {
    fetchEvents()
  }
})
</script>

<template>
  <div class="bg-base-bg min-h-screen text-text-primary">
    
    <header class="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-base-border">
      <NuxtLink to="/" class="text-accent text-2xl hover:text-accent-hover">&lt;</NuxtLink>
      
      <h1 class="text-xl font-semibold truncate">{{ currentEventName }}</h1>
    </header>

    <main class="pb-28 px-4">
      <slot />
    </main>

    <EventBottomNav :event-id="eventId" />
    <slot name="fab" />
  </div>
</template>