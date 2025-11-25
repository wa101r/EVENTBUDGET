<script setup>
const model = defineModel()
defineProps({
  label: String,
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 },
})
</script>
<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <textarea
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      class="w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
    ></textarea>
  </div>
</template>