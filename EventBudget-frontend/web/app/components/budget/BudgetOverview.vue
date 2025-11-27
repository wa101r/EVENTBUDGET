<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalBudget: { type: Number, default: 0 },
  expenses: { type: Array, default: () => [] },
  // ✅ 1. เพิ่ม prop รับค่าสกุลเงิน (Default เป็น THB)
  currency: { type: String, default: 'THB' }
})

// คำนวณยอดใช้จ่ายรวม
const totalExpenses = computed(() => {
  return props.expenses.reduce((sum, item) => sum + Number(item.amount), 0)
})

// คำนวณงบคงเหลือ
const remainingBudget = computed(() => props.totalBudget - totalExpenses.value)
const percentageUsed = computed(() => {
  if (props.totalBudget === 0) return 0
  return Math.round((totalExpenses.value / props.totalBudget) * 100)
})

// จัดกลุ่มรายจ่ายตามหมวดหมู่
const expensesByCategory = computed(() => {
  const map = {}
  props.expenses.forEach(item => {
    const cat = item.category || 'Other'
    if (!map[cat]) map[cat] = 0
    map[cat] += Number(item.amount)
  })
  return Object.entries(map).map(([name, amount]) => ({ name, amount }))
})
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
      <h3 class="text-slate-500 font-medium mb-4">งบประมาณคงเหลือ</h3>
      
      <div class="text-4xl font-extrabold" :class="remainingBudget < 0 ? 'text-red-500' : 'text-green-600'">
        {{ remainingBudget.toLocaleString() }} 
        <span class="text-lg text-slate-400 font-medium">{{ currency }}</span>
      </div>

      <p class="text-slate-400 text-sm mt-2">
        จากงบทั้งหมด {{ totalBudget.toLocaleString() }} 
        {{ currency }}
      </p>

      <div class="mt-6">
        <div class="flex justify-between text-xs text-slate-500 mb-1">
          <span>ใช้ไป {{ totalExpenses.toLocaleString() }} ({{ percentageUsed }}%)</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            class="h-2.5 rounded-full transition-all duration-500"
            :class="remainingBudget < 0 ? 'bg-red-500' : 'bg-orange-400'"
            :style="{ width: `${Math.min(percentageUsed, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="font-bold text-slate-800 mb-4">รายจ่ายแยกหมวดหมู่</h3>
      
      <div v-for="cat in expensesByCategory" :key="cat.name" class="bg-white p-4 rounded-2xl mb-3 flex justify-between items-center border border-slate-50 shadow-sm">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-lg">
               📦
             </div>
             <span class="font-medium text-slate-700">{{ cat.name }}</span>
          </div>
          <div class="text-slate-900 font-bold">
             {{ Number(cat.amount).toLocaleString() }} 
             <span class="text-xs text-slate-400 font-normal ml-1">{{ currency }}</span>
          </div>
      </div>
    </div>
  </div>
</template>