<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'primary' },
  disabled: Boolean,
})
const variantClasses = computed(() => {
  if (props.variant === 'primary') { 
    return 'bg-accent text-white hover:bg-accent-hover'
  }
  if (props.variant === 'danger') {
    return 'bg-danger text-white hover:bg-danger-hover'
  }
  return 'bg-gray-200 text-text-secondary hover:bg-gray-300' 
})
</script>
<template>
  <button
    :class="[
      'px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent',
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>