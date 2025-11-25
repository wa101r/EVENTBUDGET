<script setup>
import UiButton from '~/components/ui/UiButton.vue'

defineProps({
  t: { type: Object, required: true }
})

const emit = defineEmits(['addDay'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
      📅
    </div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t.start_timeline }}</h3>
    <p class="text-gray-500 mb-6 text-center max-w-xs">{{ t.no_timeline_data }}</p>
    <UiButton variant="secondary" @click="$emit('addDay')">
      {{ t.add_new_day }}
    </UiButton>
  </div>
</template>
