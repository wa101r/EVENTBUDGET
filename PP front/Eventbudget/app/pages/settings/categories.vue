<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'

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
  if (confirm(`ลบหมวดหมู่ "${item.name}"?`)) deleteCategory(item.id)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>หมวดหมู่ค่าใช้จ่าย</template>
    
    <div>
      <div class="max-w-3xl space-y-3">
        <UiCard v-for="cat in categories" :key="cat.id" class="flex justify-between items-center transition-all hover:shadow-md">
          <div class="flex items-center gap-4">
            <span class="text-3xl bg-gray-100 p-2 rounded-lg">{{ cat.icon }}</span>
            <span class="text-lg font-medium text-text-primary">{{ cat.name }}</span>
          </div>
          <div class="flex gap-2">
            <UiButton variant="secondary" @click="openEdit(cat)">แก้ไข</UiButton>
            <UiButton variant="danger" @click="handleDelete(cat)">ลบ</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">{{ isEditing ? 'แก้ไข' : 'เพิ่ม' }}หมวดหมู่</h3>
        
        <UiInput v-model="form.name" label="ชื่อหมวดหมู่" />
        <UiInput v-model="form.icon" label="ไอคอน (Emoji)" placeholder="เช่น 🍔" />

        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">บันทึก</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>