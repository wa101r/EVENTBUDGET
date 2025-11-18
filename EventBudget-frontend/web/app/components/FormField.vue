<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="space-y-1 mb-3">
    <label v-if="label" class="block text-sm text-black-300">
      {{ label }}
    </label>
    <div>
      <slot />
    </div>
  </div>
</template>
