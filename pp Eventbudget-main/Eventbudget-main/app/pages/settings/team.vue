<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { teamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = useSettingsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', email: '', phone: '' })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, name: '', email: '', phone: '' }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) updateTeamMember(form.value.id, form.value)
  else createTeamMember(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (confirm(`${t.value.confirm_delete_member} "${item.name}"`)) deleteTeamMember(item.id)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.team_management }}</template>
    
    <div>
      <div class="max-w-3xl space-y-3">
        <UiCard v-for="member in teamMembers" :key="member.id" class="flex justify-between items-center transition-all hover:shadow-md">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
              {{ member.name.charAt(0) }}
            </div>
            <div>
              <h4 class="font-semibold text-text-primary">{{ member.name }}</h4>
              <p class="text-sm text-text-secondary">{{ member.email }}</p>
              <p class="text-xs text-text-secondary">{{ member.phone }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <UiButton variant="secondary" @click="openEdit(member)">{{ t.edit }}</UiButton>
            <UiButton variant="danger" @click="handleDelete(member)">{{ t.delete }}</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">{{ isEditing ? t.edit_member : t.add_member }}</h3>
        
        <UiInput v-model="form.name" :label="t.label_name" />
        <UiInput v-model="form.email" :label="t.label_email" type="email" />
        <UiInput v-model="form.phone" :label="t.label_phone" />

        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">{{ t.cancel }}</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ t.save }}</UiButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>