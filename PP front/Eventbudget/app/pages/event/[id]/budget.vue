<script setup>
import UiCard from '~/components/ui/UiCard.vue'

const route = useRoute()
const { getEventById } = useEventsApi()
const { getExpensesByEventId, getExpensesByCategory } = useExpensesApi()

const eventId = route.params.id

// 1. ดึงข้อมูล Event เพื่อเอางบตั้งต้น (Total Budget)
const event = getEventById(eventId)
const budget = computed(() => Number(event.value?.total_budget) || 0)

// 2. ดึงรายการจ่ายจริง เพื่อคำนวณยอดใช้ไป (Used)
const eventExpenses = getExpensesByEventId(eventId)
const used = computed(() => eventExpenses.value.reduce((sum, item) => sum + Number(item.amount), 0))

// 3. คำนวณคงเหลือ (Remaining) และ เปอร์เซ็นต์
const remaining = computed(() => budget.value - used.value)
const percent = computed(() => {
  if (budget.value === 0) return 0
  return Math.min(100, (used.value / budget.value) * 100)
})

// 4. แยกตามหมวดหมู่ (Categories)
const categories = computed(() => getExpensesByCategory(eventId))

// Helper format เงิน
const formatMoney = (val) => val.toLocaleString('th-TH', { maximumFractionDigits: 0 })
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        ภาพรวมงบประมาณ
      </h2>

      <UiCard class="mb-6 p-6">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-text-secondary">ความคืบหน้าการใช้งบ</span>
          <span class="text-sm font-medium text-text-primary">
            งบทั้งหมด: ฿{{ formatMoney(budget) }}
          </span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            class="h-3 rounded-full transition-all duration-500 ease-out"
            :class="percent > 90 ? 'bg-red-500' : 'bg-accent'"
            :style="{ width: `${percent}%` }"
          ></div>
        </div>
        
        <div class="flex justify-between items-end mt-2">
          <div>
            <div class="text-xs text-text-secondary mb-1">ใช้ไปแล้ว</div>
            <div class="text-xl font-bold text-text-primary">฿{{ formatMoney(used) }}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-text-secondary mb-1">คงเหลือ</div>
            <div 
              class="text-xl font-bold"
              :class="remaining < 0 ? 'text-red-500' : 'text-green-600'"
            >
              ฿{{ formatMoney(remaining) }}
            </div>
          </div>
        </div>
        <div class="text-right mt-1 text-xs text-text-secondary">
          {{ percent.toFixed(1) }}% ของงบประมาณ
        </div>
      </UiCard>

      <UiCard class="p-6">
        <h3 class="text-xl font-bold text-text-primary mb-5">รายจ่ายตามหมวดหมู่</h3>
        
        <div v-if="categories.length === 0" class="text-text-secondary text-center py-4">
          ยังไม่มีรายการค่าใช้จ่าย
        </div>

        <div v-else class="space-y-5">
          <div v-for="cat in categories" :key="cat.name" class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <span class="text-2xl w-8 text-center">{{ cat.icon }}</span>
              <span class="text-text-primary font-medium">{{ cat.name }}</span>
            </div>
            <span class="text-text-primary font-bold">฿{{ formatMoney(cat.amount) }}</span>
          </div>
        </div>
      </UiCard>
    </div>
  </NuxtLayout>
</template>