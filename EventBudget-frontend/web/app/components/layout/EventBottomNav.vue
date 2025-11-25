<script setup>
defineProps({ eventId: [String, Number] })

const navItems = [
  { name: 'ภาพรวม', to: '', icon: '📊', exact: true },
  { name: 'ค่าใช้จ่าย', to: '/expenses', icon: '🧾' },
  { name: 'งบประมาณ', to: '/budget', icon: '💰' },
  // ✅ เพิ่มไทม์ไลน์กลับมาให้แล้วครับ
  { name: 'ไทม์ไลน์', to: '/timeline', icon: '🗓️' }, 
  { name: 'งาน', to: '/tasks', icon: '✅' },
]
</script>

<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
    <nav class="bg-white/90 backdrop-blur-xl border-t border-gray-200 flex justify-between items-center h-[70px] px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="`/event/${eventId}${item.to}`"
        :exact="item.exact"
        class="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform min-w-[60px]"
        active-class="text-accent"
        :class="[
          ($route.path === `/event/${eventId}${item.to}` || ($route.path === `/event/${eventId}` && item.to === ''))
            ? 'text-accent' 
            : 'text-gray-400 hover:text-gray-600'
        ]"
      >
        <span class="text-2xl mb-0.5">{{ item.icon }}</span>
        <span class="text-[10px] font-medium truncate w-full text-center px-0.5">
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>