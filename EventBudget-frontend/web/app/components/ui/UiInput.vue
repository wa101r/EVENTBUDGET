<script setup>
const model = defineModel()
defineProps({
  label: String,
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
})
</script>
<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type"
      v-model="model"
      :placeholder="placeholder"
      class="w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
    />
  </div>
</template>