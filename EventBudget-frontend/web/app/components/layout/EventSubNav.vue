<script setup>
import { computed } from 'vue'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
defineProps({ eventId: [String, Number] })

// Logic เดิม: รายการเมนู
const navItems = computed(() => [
  { name: t.value.tab_dashboard || 'ภาพรวม', to: '', icon: '📊', exact: true },
  { name: t.value.tab_budget || 'งบประมาณ', to: '/budget', icon: '💰' },
  { name: t.value.tab_expenses || 'รายจ่าย', to: '/expenses', icon: '🧾' },
  { name: t.value.tab_timeline || 'ไทม์ไลน์', to: '/timeline', icon: '🗓️' },
  { name: t.value.tab_tasks || 'งาน', to: '/tasks', icon: '✅' },
])
</script>

<template>
  <nav class="flex gap-6 overflow-x-auto custom-scrollbar -mb-px">
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="`/event/${eventId}${item.to}`"
      :exact="item.exact"
      class="pb-3 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2"
      active-class="border-accent text-accent"
      :class="[
        $route.path === `/event/${eventId}${item.to}` 
          ? 'border-accent text-accent' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      ]"
    >
      <span class="text-lg">{{ item.icon }}</span>
      <span>{{ item.name }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 0px; background: transparent; }
</style>