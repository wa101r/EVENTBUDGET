<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { currencies, createCurrency, updateCurrency, deleteCurrency } = useSettingsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, code: '', name: '', rate_to_base: 1.0 })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, code: '', name: '', rate_to_base: 1.0 }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) updateCurrency(form.value.id, form.value)
  else createCurrency(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (item.is_base_currency) return alert(t.value.cannot_delete_base)
  if (confirm(`${t.value.confirm_delete} "${item.code}"?`)) deleteCurrency(item.id)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.currency_management }}</template>
    
    <div>
      <div class="max-w-3xl space-y-3">
        <UiCard v-for="cur in currencies" :key="cur.id" class="flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-text-primary">{{ cur.code }}</span>
              <span v-if="cur.is_base_currency" class="text-xs bg-accent text-white px-2 py-0.5 rounded-full">Base</span>
            </div>
            <p class="text-sm text-text-secondary">{{ cur.name }}</p>
            <p class="text-sm text-text-primary font-medium mt-1">Rate: {{ cur.rate_to_base }}</p>
          </div>
          <div class="flex gap-2">
            <UiButton variant="secondary" @click="openEdit(cur)">{{ t.edit }}</UiButton>
            <UiButton v-if="!cur.is_base_currency" variant="danger" @click="handleDelete(cur)">{{ t.delete }}</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">{{ isEditing ? t.edit_currency : t.add_currency }}</h3>
        
        <UiInput v-model="form.code" :label="t.label_code" />
        <UiInput v-model="form.name" :label="t.label_currency_name" />
        <UiInput v-model.number="form.rate_to_base" :label="t.label_rate" type="number" />

        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">{{ t.cancel }}</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ t.save }}</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>