<script setup>
defineProps({
  day: { type: Object, required: true },
  isOpen: { type: Boolean, required: true },
  t: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'addItem', 'deleteDay'])
</script>

<template>
  <div
    @click="$emit('toggle')"
    class="sticky top-[70px] z-10 py-3 -mx-4 px-4 sm:mx-0 sm:px-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all duration-200 group/header select-none"
  >
    <div class="flex items-center gap-4">
      <div class="transition-transform duration-300 text-gray-400" :class="{ 'rotate-180': !isOpen }">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div class="flex items-center gap-3">
        <div class="bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold text-lg min-w-[3rem] text-center">
          {{ new Date(day.date).getDate() }}
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 line-clamp-1">{{ day.title }}</h3>
          <p class="text-xs text-gray-500">
            {{ new Date(day.date).toLocaleDateString('th-TH', { month: 'long', year: 'numeric', weekday: 'long' }) }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2" @click.stop>
      <button
        @click="$emit('addItem')"
        class="text-accent hover:bg-accent/10 p-2 rounded-lg transition-colors text-sm font-semibold hidden sm:flex items-center gap-1"
      >
        <span>{{ t.add_activity_btn }}</span>
      </button>

      <button
        @click="$emit('deleteDay')"
        class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
        :title="t.delete_day_btn"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
