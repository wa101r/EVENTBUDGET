<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// ไม่ต้องรับ Props แล้ว ให้ดึงจาก URL โดยตรง แม่นยำกว่า
// const props = defineProps({ eventId: ... }) 

const route = useRoute()

// ดึง eventId จาก URL ปัจจุบัน (เช่น /event-manage/1/expenses -> ได้เลข 1)
const currentEventId = computed(() => route.params.id)

const tabs = computed(() => {
  const id = currentEventId.value
  // ถ้าไม่มี ID (เช่น Error) ให้ลิงก์ไปหน้าหลักก่อน
  if (!id) return []

  return [
    // หน้า Home ต้องเช็คแบบ Exact Match (ระบุ path แบบเต็ม)
    { key: "expenses", label: "Expenses", icon: "🧾", to: `/event-manage/${id}/expenses` },
    { key: "tasks", label: "Tasks", icon: "✅", to: `/event-manage/${id}/tasks` },
    { key: "dashboard", label: "Home", icon: "🏠", to: `/event-manage/${id}`, exact: true },
    { key: "timeline", label: "Timeline", icon: "🗓️", to: `/event-manage/${id}/timeline` },
    { key: "budget", label: "Budget", icon: "💵", to: `/event-manage/${id}/budget` },
  ]
})

// ฟังก์ชันเช็คว่าปุ่มไหน Active
const checkActive = (tab) => {
  // ถ้าเป็นปุ่ม Home (Dashboard) ให้เช็คว่า URL ต้องตรงกันเป๊ะๆ เท่านั้น
  if (tab.exact) {
    return route.path === tab.to
  }
  // ปุ่มอื่นใช้ startsWith ได้ (เช่น /expenses/add ก็ยังถือว่าอยู่ expenses)
  return route.path.startsWith(tab.to)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-50 safe-area-pb">
    <div class="grid grid-cols-5 text-center py-2">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="tab.to"
        class="flex flex-col items-center gap-0.5"
      >
        <div 
          class="text-xs flex flex-col items-center transition-colors duration-200"
          :class="checkActive(tab) ? 'text-orange-600 font-bold' : 'text-gray-400 hover:text-gray-600'"
        >
          <span class="text-xl mb-0.5">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </div>
      </NuxtLink>
    </div>
  </nav>

  <div class="h-24"></div> 
</template>

<style scoped>
/* รองรับ iPhone รุ่นใหม่ๆ ที่มีขีดด้านล่าง */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>