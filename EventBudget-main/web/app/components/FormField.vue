<template>
  <div>
    <label class="block text-gray-300 mb-1">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: String
})
</script>