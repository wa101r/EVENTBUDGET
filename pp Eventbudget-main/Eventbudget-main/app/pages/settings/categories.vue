<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { categories, createCategory, updateCategory, deleteCategory } = useSettingsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', icon: '' })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, name: '', icon: '' }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) updateCategory(form.value.id, form.value)
  else createCategory(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (confirm(`${t.value.confirm_delete} "${item.name}"?`)) deleteCategory(item.id)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.settings_categories }}</template>
    
    <div>
      <div class="max-w-3xl space-y-3">
        <UiCard v-for="cat in categories" :key="cat.id" class="flex justify-between items-center transition-all hover:shadow-md">
          <div class="flex items-center gap-4">
            <span class="text-3xl bg-gray-100 p-2 rounded-lg">{{ cat.icon }}</span>
            <span class="text-lg font-medium text-text-primary">{{ cat.name }}</span>
          </div>
          <div class="flex gap-2">
            <UiButton variant="secondary" @click="openEdit(cat)">{{ t.edit }}</UiButton>
            <UiButton variant="danger" @click="handleDelete(cat)">{{ t.delete }}</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">{{ isEditing ? t.settings_edit_category : t.settings_add_category }}</h3>
        
        <UiInput v-model="form.name" :label="t.label_cat_name" />
        <UiInput v-model="form.icon" :label="t.label_cat_icon" placeholder="🍔" />

        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">{{ t.cancel }}</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ t.save }}</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>