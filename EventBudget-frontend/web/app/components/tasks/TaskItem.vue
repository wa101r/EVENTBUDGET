<script setup>
const props = defineProps({
  task: { type: Object, required: true }
})
defineEmits(['toggle', 'delete'])
</script>

<template>
  <div class="group flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 transition-colors">
    
    <button 
      @click="$emit('toggle', task)"
      class="h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0"
      :class="task.is_completed ? 'bg-orange-500 border-orange-500' : 'border-slate-300 hover:border-orange-400'"
    >
      <svg v-if="task.is_completed" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <div class="flex-1 min-w-0">
      <div 
        class="text-sm font-medium truncate transition-all"
        :class="task.is_completed ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-800'"
      >
        {{ task.title }}
      </div>

      <div v-if="task.due_date" class="text-xs text-slate-400 mt-0.5 flex gap-2">
        <span>📅 {{ task.due_date }}</span>
        <span v-if="task.due_time">⏰ {{ task.due_time.substring(0, 5) }}</span>
      </div>
    </div>

    <button 
      @click.stop="$emit('delete', task.id)"
      class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
    >
      🗑
    </button>
  </div>
</template>