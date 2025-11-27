<script setup lang="ts">
defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    class="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center text-2xl hover:bg-orange-600 active:scale-90 transition-all z-[60]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</template>