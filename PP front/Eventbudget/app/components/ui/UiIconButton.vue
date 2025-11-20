<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'secondary' }, // 'secondary' (เทา), 'danger' (แดง), 'primary' (ส้ม)
  disabled: Boolean,
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-accent text-white hover:bg-accent-hover'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700'
    case 'secondary':
    default:
      return 'bg-gray-200 text-text-secondary hover:bg-gray-300'
  }
})
</script>

<template>
  <button
    :class="[
      'w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent',
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>