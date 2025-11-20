<script setup>
defineProps({ event: Object })

// ฟังก์ชันจัดรูปแบบเงิน
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount)
}
</script>

<template>
  <div 
    class="group bg-white rounded-lg shadow-sm p-5 border border-base-border 
           transition-all duration-200 cursor-pointer transform hover:scale-[1.01] hover:shadow-md"
  >
    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <h3 class="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
          {{ event.name }}
        </h3>
        <div class="flex flex-wrap gap-3 mt-2 text-sm text-text-secondary">
          <span class="flex items-center gap-1">
            👤 {{ event.client_name || 'ไม่ระบุลูกค้า' }}
          </span>
          <span v-if="event.location" class="flex items-center gap-1">
            📍 {{ event.location }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-2">
        <span class="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full text-text-secondary border border-base-border">
          📅 {{ event.start_date || 'ไม่ระบุวันที่' }}
        </span>
        <span v-if="event.total_budget" class="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          💰 {{ formatCurrency(event.total_budget) }}
        </span>
      </div>
    </div>
  </div>
</template>