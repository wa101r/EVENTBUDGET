<script setup>
const props = defineProps({
  eventId: { type: [String, Number], required: true },
})

const route = useRoute()

const tabs = computed(() => {
  const id = props.eventId
  return [
    { key: "expenses", label: "Expenses", icon: "🧾", to: `/event-manage/${id}/expenses` },
    { key: "tasks", label: "Tasks", icon: "✅", to: `/event-manage/${id}/tasks` },
    { key: "dashboard", label: "Home", icon: "🏠", to: `/event-manage/${id}` },
    { key: "timeline", label: "Timeline", icon: "🗓️", to: `/event-manage/${id}/timeline` },
    { key: "budget", label: "Budget", icon: "💵", to: `/event-manage/${id}/budget` },
  ]
})

const isActive = (to) => route.path.startsWith(to)
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40">
    <div class="grid grid-cols-5 text-center py-2">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="tab.to"
        class="flex flex-col items-center text-xs"
        :class="isActive(tab.to) ? 'text-orange-600 font-semibold' : 'text-gray-500'"
      >
        <div class="text-lg">{{ tab.icon }}</div>
        {{ tab.label }}
      </NuxtLink>
    </div>
  </nav>

  <div class="h-20"></div> <!-- กันไม่ให้ content ชนแท็บบาร์ -->
</template>
