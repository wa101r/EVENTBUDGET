<script setup>
defineProps({
  item: { type: Object, required: true },
  t: { type: Object, required: true }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="relative mb-6 last:mb-0 group/item">
    <div class="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
      <!-- time column -->
      <div class="sm:w-[140px] flex-shrink-0 pl-10 sm:pl-0 sm:text-right sm:pr-10 pt-1 relative">
        <span class="text-base font-bold text-gray-900 font-numeric block">{{ item.start_time }}</span>
        <span
          class="text-xs font-medium text-gray-400 font-numeric block mt-0.5"
          v-if="item.end_time"
        >
          {{ t.label_end_time }} {{ item.end_time }}
        </span>
      </div>

      <!-- dot -->
      <div class="absolute left-[19px] sm:left-[130px] top-1.5 w-[18px] h-[18px] rounded-full border-[3px] border-white shadow-sm z-10 transition-transform duration-200 group-hover/item:scale-110 bg-accent"></div>

      <!-- card -->
      <div class="flex-1 pr-1">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative group/card overflow-hidden">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-lg bg-gray-50 text-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
              {{ item.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="text-base font-bold text-gray-900 leading-tight">{{ item.title }}</h4>
              <p v-if="item.description" class="text-gray-500 text-sm mt-1 line-clamp-2">
                {{ item.description }}
              </p>
              <div v-if="item.location" class="flex flex-wrap gap-2 mt-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500">
                  📍 {{ item.location }}
                </span>
              </div>
            </div>
          </div>

          <!-- actions -->
          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-white/90 p-1 rounded-lg">
            <button
              @click.stop="$emit('edit')"
              class="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"/>
              </svg>
            </button>

            <button
              @click.stop="$emit('delete')"
              class="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
