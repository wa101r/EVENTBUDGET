<script setup>
import { computed } from "vue"
import UiCard from "~/components/ui/UiCard.vue"
import { useAppLocale } from "~/composables/useAppLocale"

// ตั้งค่า Layout (ใช้ detail ที่มี TabBar ด้านล่างอยู่แล้ว)
definePageMeta({
  layout: "detail",
  title: "Event Dashboard"
})

const { t } = useAppLocale()
const route = useRoute()
const eventId = route.params.id
const config = useRuntimeConfig()
const API_URL = config.public.apiBase || 'http://localhost:8000/api'

// ✅ 1. ดึงข้อมูล Event เดียวโดยตรง (เร็วกว่าดึงทั้งหมด)
const { data: event, pending } = await useFetch(`${API_URL}/events/${eventId}`)

// ✅ 2. ฟังก์ชันจัดรูปแบบเงิน (รองรับสกุลเงินจาก DB)
const formatCurrency = (val) => {
  const num = Number(val || 0)
  // เช็คชื่อคอลัมน์ใน DB (currency_code หรือ currency)
  const code = (event.value?.currency_code || event.value?.currency || "THB").toUpperCase()
  
  try {
    return new Intl.NumberFormat(code === "THB" ? "th-TH" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0 // ไม่เอาทศนิยมให้รกตา
    }).format(num)
  } catch {
    return `${num.toLocaleString()} ${code}`
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      
    <div v-if="pending" class="text-center text-gray-400 py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
      {{ t.loading || "กำลังโหลด..." }}
    </div>

    <div v-else-if="event">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1">
          {{ event.name || "Untitled Event" }}
        </h1>
        <p class="text-gray-500 text-sm mb-6 flex items-center gap-2">
           <span v-if="event.client_name">👤 {{ event.client_name }}</span>
           <span v-if="event.client_website" class="text-gray-300">|</span>
           <a v-if="event.client_website" :href="event.client_website" target="_blank" class="text-orange-500 hover:underline">
             {{ event.client_website }}
           </a>
        </p>
      </div>

      <UiCard class="p-6 shadow-sm border border-slate-100">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div class="flex items-center gap-3">
            <span class="text-2xl w-10 text-center">📅</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">{{ t.event_date || "วันที่จัดงาน" }}</p>
              <p class="text-slate-800 font-bold">
                {{ event.start_date || "-" }} 
                <span v-if="event.end_date" class="text-gray-400"> ถึง </span>
                {{ event.end_date }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl w-10 text-center">💰</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">{{ t.budget || "งบประมาณ" }}</p>
              <p class="text-orange-600 font-bold text-lg">
                {{ formatCurrency(event.total_budget || event.amount) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl w-10 text-center">📍</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">{{ t.location || "สถานที่" }}</p>
              <p class="text-slate-800 font-medium">
                {{ event.venue_name || event.location || "-" }}
              </p>
            </div>
          </div>

        </div>

        <div class="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
          <span class="text-2xl w-10 text-center">📁</span>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ t.files || "ไฟล์งาน" }}</p>
            <a
              v-if="event.online_drive || event.drive_link"
              :href="event.online_drive || event.drive_link"
              target="_blank"
              class="text-blue-500 hover:underline font-medium flex items-center gap-1"
            >
              Google Drive Link ↗
            </a>
            <span v-else class="text-gray-400 text-sm">
              {{ t.no_link || "ยังไม่มีลิงก์" }}
            </span>
          </div>
        </div>
      </UiCard>
    </div>
    
    <div v-else class="text-center py-20">
        <p>ไม่พบข้อมูล Event นี้</p>
    </div>
  </div>

  </template>