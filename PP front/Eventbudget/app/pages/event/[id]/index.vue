<script setup>
import UiCard from '~/components/ui/UiCard.vue'

const route = useRoute()
const { getEventById } = useEventsApi()

// ดึงข้อมูลอีเวนต์ตาม ID
const event = getEventById(route.params.id)

// Helper สำหรับจัดรูปแบบเงิน
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
}
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <UiCard v-if="event" class="p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-text-primary mb-2">{{ event.name }}</h2>
          <p class="text-text-secondary whitespace-pre-line">{{ event.description || 'ไม่มีรายละเอียด' }}</p>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📅</span>
              <div>
                <p class="text-sm text-gray-500">วันจัดงาน</p>
                <p class="text-text-primary font-medium">
                  {{ event.start_date || '-' }} ถึง {{ event.end_date || '-' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">💰</span>
              <div>
                <p class="text-sm text-gray-500">งบประมาณ</p>
                <p class="text-text-primary font-medium">{{ formatCurrency(event.total_budget) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">👤</span>
              <div>
                <p class="text-sm text-gray-500">ลูกค้า</p>
                <p class="text-text-primary font-medium">{{ event.client_name || '-' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📍</span>
              <div>
                <p class="text-sm text-gray-500">สถานที่ (Location)</p>
                <p class="text-text-primary font-medium">{{ event.location || '-' }}</p>
              </div>
            </div>
          </div>

          <hr class="border-base-border my-4" />
          
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">🏛️</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">สถานที่จัดงาน (Venue)</p>
                <div v-if="event.venue_url">
                    <a :href="event.venue_url" target="_blank" class="text-accent hover:underline font-medium">
                        {{ event.venue_name || 'เปิดลิงก์สถานที่' }} ↗
                    </a>
                </div>
                <span v-else class="text-text-primary">{{ event.venue_name || '-' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">🏨</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">ที่พัก (Accommodation)</p>
                <div v-if="event.accommodation_url">
                    <a :href="event.accommodation_url" target="_blank" class="text-accent hover:underline font-medium">
                        {{ event.accommodation_name || 'เปิดลิงก์ที่พัก' }} ↗
                    </a>
                </div>
                <span v-else class="text-text-primary">{{ event.accommodation_name || '-' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📁</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">ไฟล์งาน</p>
                <a v-if="event.drive_link" :href="event.drive_link" target="_blank" class="text-accent hover:underline font-medium">
                  Google Drive Link ↗
                </a>
                <span v-else class="text-text-secondary text-sm">ไม่มีลิงก์</span>
              </div>
            </div>
          </div>

        </div>
      </UiCard>
      
      <div v-else class="text-center text-text-secondary p-8 bg-white rounded-xl shadow-sm">
        <p class="text-lg">ไม่พบข้อมูลอีเวนต์</p>
      </div>
    </div>
    
    <template #fab></template>
    
  </NuxtLayout>
</template>