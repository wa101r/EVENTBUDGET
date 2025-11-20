<script setup>
defineProps({ eventId: [String, Number] })
const navItems = [
  { name: 'รายละเอียด', to: '', icon: '📊' },
  { name: 'ติดตามค่าใช้จ่าย', to: '/expenses', icon: '🧾' },
  { name: 'งบประมาณ', to: '/budget', icon: '💰' },
  { name: 'ปฏิทิน', to: '/timeline', icon: '🗓️' },
  { name: 'งาน', to: '/tasks', icon: '✅' },
]
</script>
<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-base-border h-20 flex justify-around items-center z-20 shadow-[-0px_-2px_10px_rgba(0,0,0,0.05)]">
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="`/event/${eventId}${item.to}`"
      class="flex flex-col items-center justify-center text-text-secondary hover:text-accent w-full h-full pt-2 text-center"
      active-class="!text-accent"
      :exact-active-class="item.to === '' ? '!text-accent' : ''"
    >
      <span class="text-2xl">{{ item.icon }}</span>
      <span class="text-xs mt-1">{{ item.name }}</span>
    </NuxtLink>
  </nav>
</template>