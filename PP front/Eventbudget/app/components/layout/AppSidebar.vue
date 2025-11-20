<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
})
const emits = defineEmits(['close'])

const menuItems = [
  { name: 'Event Management', to: '/', icon: '📅' },
  { name: 'Expense Categories', to: '/settings/categories', icon: '💳' },
  { name: 'Currency Management', to: '/settings/currency', icon: '💲' },
  { name: 'Team Management', to: '/settings/team', icon: '👥' },
  { name: 'General Settings', to: '/settings', icon: '⚙️' },
]

onMounted(() => {
  watch(() => props.isOpen, (val) => {
    if (val) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, { 
    immediate: true 
  })
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

watch(() => useRoute().fullPath, () => {
  if (props.isOpen) {
    emits('close')
  }
})

</script>

<template>
  <div>
    <div 
      v-if="isOpen" 
      @click="$emit('close')"
      class="fixed inset-0 bg-black bg-opacity-70 z-30 transition-opacity duration-300"
    ></div>

    <aside 
      :class="[
        'fixed top-0 left-0 h-full w-72 bg-accent text-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 flex items-center justify-between border-b border-white/20">
        <h2 class="text-2xl font-bold text-white">EventBudget</h2>
        <button @click="$emit('close')" class="text-2xl hover:text-white/70">✕</button>
      </div>
      <nav class="p-4 space-y-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-colors"
          active-class="!bg-white/20"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>