<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useExpensesApi } from '~/composables/useExpensesApi'
import EventTabBar from '~/components/layout/EventTabBar.vue'

definePageMeta({
  layout: "detail",
  title: "Budget Overview"
})

const route = useRoute()
const eventId = route.params.id
const config = useRuntimeConfig()
const API_URL = config.public.apiBase || 'http://localhost:8000/api'

const { getExpenses, getExpensesByCategory } = useExpensesApi()

// --- 1. ดึงข้อมูล Event ---
const { data: eventData, error: eventError } = await useFetch(`${API_URL}/events/${eventId}`)

// --- 2. ดึงข้อมูลรายจ่าย ---
const { data: expenses, pending: expensesPending } = await getExpenses(eventId)

// ✅ 3. ดึงสกุลเงินจาก Event (ถ้าไม่มีให้เป็น THB)
const currency = computed(() => {
  return eventData.value?.currency_code || eventData.value?.currency || 'THB'
})

// --- Computed ---
const totalBudget = computed(() => {
  if (!eventData.value) return 0
  return Number(eventData.value.total_budget || eventData.value.total || 0)
})

const totalSpent = computed(() => {
  const list = expenses.value || []
  return list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const remaining = computed(() => totalBudget.value - totalSpent.value)

const percentageUsed = computed(() => {
  if (totalBudget.value === 0) return 0
  const pct = (totalSpent.value / totalBudget.value) * 100
  return Math.min(pct, 100)
})

const isOverBudget = computed(() => totalSpent.value > totalBudget.value)

const categoryBreakdown = computed(() => {
  return getExpensesByCategory(expenses.value || []).sort((a, b) => b.amount - a.amount)
})

const formatMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 })
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Budget Overview</h1>
      <p class="text-slate-500 text-sm">บริหารจัดการงบประมาณ</p>
    </div>

    <div v-if="!eventData && !eventError" class="p-4 bg-yellow-50 text-yellow-600 rounded-xl text-sm">
      กำลังโหลดข้อมูลงบประมาณ...
    </div>

    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-60"></div>

      <div class="relative z-10 text-center space-y-2">
        <p class="text-slate-500 font-medium">งบประมาณคงเหลือ</p>
        
        <h2 class="text-4xl font-extrabold tracking-tight transition-colors"
            :class="isOverBudget ? 'text-red-500' : 'text-green-600'">
          {{ formatMoney(remaining) }} 
          <span class="text-lg font-normal text-slate-400">{{ currency }}</span>
        </h2>
        
        <div v-if="isOverBudget" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold animate-pulse">
          ⚠️ เกินงบ {{ formatMoney(totalSpent - totalBudget) }} {{ currency }}
        </div>
        <div v-else class="text-xs text-slate-400">
           จากงบทั้งหมด {{ formatMoney(totalBudget) }} {{ currency }}
        </div>
      </div>

      <div class="mt-8">
        <div class="flex justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>ใช้ไป {{ formatMoney(totalSpent) }} ({{ ((totalSpent/totalBudget)*100 || 0).toFixed(0) }}%)</span>
        </div>
        <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            :class="isOverBudget ? 'bg-red-500' : 'bg-orange-500'"
            :style="{ width: `${percentageUsed}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-bold text-slate-800 mb-4">รายจ่ายแยกหมวดหมู่</h3>
      
      <div v-if="expensesPending" class="space-y-3">
         <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else-if="categoryBreakdown.length === 0" class="text-center py-8 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        ยังไม่มีข้อมูลรายจ่าย
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="cat in categoryBreakdown" 
          :key="cat.name"
          class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-sm transition"
        >
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-xl shrink-0">
              {{ cat.icon }}
            </div>
            <div>
              <div class="font-semibold text-slate-800">{{ cat.name }}</div>
              <div class="text-xs text-slate-400" v-if="totalSpent > 0">
                {{ ((cat.amount / totalSpent) * 100).toFixed(1) }}% ของรายจ่ายทั้งหมด
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-bold text-slate-800">{{ formatMoney(cat.amount) }}</div>
            <div class="text-[10px] text-slate-400">{{ currency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>