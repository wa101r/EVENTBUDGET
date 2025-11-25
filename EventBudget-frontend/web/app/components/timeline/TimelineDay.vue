<script setup>
import TimelineDayHeader from './TimelineDayHeader.vue'
import TimelineItemCard from './TimelineItemCard.vue'

defineProps({
  day: { type: Object, required: true },
  isOpen: { type: Boolean, required: true },
  t: { type: Object, required: true }
})

const emit = defineEmits([
  'toggle',
  'addItem',
  'editItem',
  'deleteItem',
  'deleteDay'
])
</script>

<template>
  <div class="relative mb-8 last:mb-0">
    <TimelineDayHeader
      :day="day"
      :isOpen="isOpen"
      :t="t"
      @toggle="$emit('toggle')"
      @addItem="$emit('addItem')"
      @deleteDay="$emit('deleteDay')"
    />

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 translate-y-0 max-h-[1000px] overflow-visible"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-[1000px] overflow-visible"
      leave-to-class="opacity-0 -translate-y-4 max-h-0 overflow-hidden"
    >
      <div v-show="isOpen" class="relative pl-4 sm:pl-2 pb-4">
        <div class="absolute left-[27px] sm:left-[138px] top-0 bottom-0 w-[2px] bg-gray-100"></div>

        <div v-if="day.items.length === 0" class="pl-12 sm:pl-[160px] py-6">
          <button
            @click="$emit('addItem')"
            class="text-gray-400 hover:text-accent text-sm flex items-center gap-2 border border-dashed border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ t.add_first_activity }}
          </button>
        </div>

        <div v-for="item in day.items" :key="item.id">
          <TimelineItemCard
            :item="item"
            :t="t"
            @edit="$emit('editItem', item)"
            @delete="$emit('deleteItem', item.id)"
          />
        </div>

        <div
          v-if="day.items.length > 0"
          class="ml-[31px] sm:ml-[140px] pl-10 sm:pl-0 mt-2 relative z-0"
        >
          <button
            @click="$emit('addItem')"
            class="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-accent transition-colors py-1.5 px-3 rounded-lg hover:bg-orange-50 border border-dashed border-gray-200 hover:border-accent/30 w-full sm:w-auto"
          >
            <span class="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center text-lg transition-colors">
              +
            </span>
            {{ t.add_next_activity }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
