<script setup>
import { computed } from 'vue'

const props = defineProps({
  expense: { type: Object, required: true },
  // ✅ รับ prop currency
  currency: { type: String, default: 'THB' }
})

const emit = defineEmits(["edit", "delete"])

const formattedAmount = computed(() => {
  const amount = Number(props.expense.amount) || 0
  return amount.toLocaleString("en-US", { minimumFractionDigits: 0 })
})

const formattedDate = computed(() => {
  if (!props.expense.date) return "-"
  const d = new Date(props.expense.date)
  if (isNaN(d.getTime())) return props.expense.date 
  
  return d.toLocaleDateString("th-TH", { 
    day: "numeric", 
    month: "short", 
    year: "2-digit" 
  })
})
</script>

<template>
  <div
    class="bg-white hover:bg-orange-50/30 transition rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 group"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-slate-800 truncate text-base">
          {{ expense.name }}
        </div>

        <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <span class="bg-slate-100 px-2 py-0.5 rounded-md">📅 {{ formattedDate }}</span>
          <span v-if="expense.time" class="flex items-center gap-1">
            • ⏰ {{ expense.time.substring(0, 5) }} </span>
        </div>
      </div>

      <div class="text-right shrink-0">
        <div class="text-lg font-bold text-orange-600">
          {{ formattedAmount }}
        </div>
        <div class="text-[10px] text-slate-400 uppercase">{{ currency }}</div>
      </div>
    </div>

    <div class="flex items-center justify-between pt-1">
      <span
        v-if="expense.category"
        class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-100 text-orange-700 border border-orange-200"
      >
        {{ expense.category }}
      </span>
      <span v-else class="text-[11px] text-slate-400 italic">ไม่ระบุหมวดหมู่</span>

      <div class="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          class="p-1.5 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition"
          title="แก้ไข"
          @click.stop="$emit('edit', expense)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
        </button>
        <button
          class="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
          title="ลบ"
          @click.stop="$emit('delete', expense.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>