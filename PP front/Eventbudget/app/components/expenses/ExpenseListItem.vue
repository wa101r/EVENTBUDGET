<script setup>
import UiCard from '~/components/ui/UiCard.vue'
defineProps({ expense: Object })
</script>
<template>
  <UiCard class="mb-2">
    <div class="flex justify-between items-center">
      <div>
        <h4 class="font-semibold text-text-primary">{{ expense.name }}</h4>
        <p class="text-sm text-text-secondary">{{ expense.category }} - {{ expense.date }}</p>
      </div>
      <div class="text-lg font-bold text-accent">${{ expense.amount.toFixed(2) }}</div>
    </div>
  </UiCard>
</template>