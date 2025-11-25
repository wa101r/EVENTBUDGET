<script setup>
import { computed, onMounted } from "vue"
import UiCard from "~/components/ui/UiCard.vue"
import { useAppLocale } from "~/composables/useAppLocale"
import { useEventsApi } from "~/composables/useEventsApi"
import EventTabBar from '~/components/layout/EventTabBar.vue'



definePageMeta({
  layout: "header",
  title: "Event Dashboard"
})

const { t } = useAppLocale()
const route = useRoute()
const eventId = computed(() => Number(route.params.id))

const { events, fetchEvents } = useEventsApi()

// ✅ ทำให้ reactive: หา event จาก events list ตลอดเวลา
const event = computed(() =>
  events.value.find(e => Number(e.id) === eventId.value) || null
)

// โหลด events ถ้ายังไม่มี
onMounted(async () => {
  if (!events.value.length) {
    await fetchEvents()
  }
})

// formatter ง่ายๆ (ใช้สกุลเงินของ event ถ้ามี)
const formatCurrency = (val) => {
  const num = Number(val || 0)
  const code = (event.value?.currency_code || event.value?.currency || "THB").toUpperCase()
  try {
    return new Intl.NumberFormat(code === "THB" ? "th-TH" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2
    }).format(num)
  } catch {
    return `${num.toLocaleString()} ${code}`
  }
}
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- ถ้าไม่เจอ event -->
      <div v-if="!event" class="text-center text-gray-400 py-20">
        {{ t.loading || "กำลังโหลด..." }}
      </div>

      <!-- ถ้าเจอ event -->
      <div v-else>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1">
          {{ event.name || event.title || "Untitled Event" }}
        </h1>
        <p class="text-gray-500 text-sm mb-6">
          {{ event.client_name || event.client || "-" }}
        </p>

        <UiCard class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📅</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.event_date || "วันที่จัดงาน" }}</p>
                <p class="text-text-primary font-medium">
                  {{ (event.start_date || event.start || "-") }}
                  -
                  {{ (event.end_date || event.end || "-") }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">💰</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.budget || "งบประมาณ" }}</p>
                <p class="text-text-primary font-medium">
                  {{ formatCurrency(event.total_budget ?? event.base_total ?? event.total ?? 0) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📍</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.location || "สถานที่" }}</p>
                <p class="text-text-primary font-medium">
                  {{ event.venue_name || event.location || event.country || "-" }}
                </p>
              </div>
            </div>

          </div>

          <!-- Drive link -->
          <div class="mt-6 flex items-center gap-3">
            <span class="text-accent text-xl w-8 text-center">📁</span>
            <div>
              <p class="text-sm text-gray-500">{{ t.files || "ไฟล์งาน" }}</p>
              <a
                v-if="event.drive_link"
                :href="event.drive_link"
                target="_blank"
                class="text-accent hover:underline font-medium"
              >
                Google Drive Link ↗
              </a>
              <span v-else class="text-text-secondary text-sm">
                {{ t.no_link || "ยังไม่มีลิงก์" }}
              </span>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </NuxtLayout>
  <EventTabBar :event-id="eventId" />
</template>
