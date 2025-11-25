<script setup>
import EventTabBar from "~/components/layout/EventTabBar.vue"
import UiCard from '~/components/ui/UiCard.vue'
import { useAppLocale } from '~/composables/useAppLocale'
import { useEventsApi } from '~/composables/useEventsApi'
import { useExpensesApi } from '~/composables/useExpensesApi'

definePageMeta({
  layout: "header",
  title: "Expenses",
})

const route = useRoute()
const { t } = useAppLocale()

// composables
const { getEventById } = useEventsApi()
const { getExpensesByEventId, getExpensesByCategory } = useExpensesApi()

// event id
const eventId = computed(() => Number(route.params.id))

// data
const event = getEventById(eventId.value)
const budget = computed(() => Number(event.value?.total_budget) || 0)

const eventExpenses = getExpensesByEventId(eventId.value)
const used = computed(() =>
  eventExpenses.value.reduce((sum, item) => sum + Number(item.amount), 0)
)

const remaining = computed(() => budget.value - used.value)

const percent = computed(() => {
  if (budget.value === 0) return 0
  return Math.min(100, (used.value / budget.value) * 100)
})

const categories = computed(() =>
  getExpensesByCategory(eventId.value) || []
)

const formatMoney = (val) =>
  Number(val).toLocaleString("th-TH", { maximumFractionDigits: 0 })
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        {{ t.budget_overview }}
      </h2>

      <UiCard class="mb-6 p-6">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-text-secondary">
            {{ t.budget_progress }}
          </span>
          <span class="text-sm font-medium text-text-primary">
            {{ t.total_budget }}: ฿{{ formatMoney(budget) }}
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
            <div class="text-xs text-text-secondary mb-1">
              {{ t.used }}
            </div>
            <div class="text-xl font-bold text-text-primary">
              ฿{{ formatMoney(used) }}
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs text-text-secondary mb-1">
              {{ t.remaining }}
            </div>
            <div
              class="text-xl font-bold"
              :class="remaining < 0 ? 'text-red-500' : 'text-green-600'"
            >
              ฿{{ formatMoney(remaining) }}
            </div>
          </div>
        </div>

        <div class="text-right mt-1 text-xs text-text-secondary">
          {{ percent.toFixed(1) }}% {{ t.of_budget }}
        </div>
      </UiCard>

      <UiCard class="p-6">
        <h3 class="text-xl font-bold text-text-primary mb-5">
          {{ t.expenses_by_category }}
        </h3>

        <div
          v-if="!categories.length"
          class="text-text-secondary text-center py-4"
        >
          {{ t.no_expenses_data }}
        </div>

        <div v-else class="space-y-5">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="flex justify-between items-center"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl w-8 text-center">{{ cat.icon }}</span>
              <span class="text-text-primary font-medium">
                {{ cat.name }}
              </span>
            </div>
            <span class="text-text-primary font-bold">
              ฿{{ formatMoney(cat.amount) }}
            </span>
          </div>
        </div>
      </UiCard>
    </div>
  </NuxtLayout>

  <!-- bottom tab bar -->
  <EventTabBar :event-id="eventId" />
</template>
