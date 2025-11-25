<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  form: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  availableIcons: { type: Array, default: () => [] },
  t: { type: Object, required: true }
})

const emit = defineEmits(['close', 'save', 'update:form'])

const update = (key, val) => {
  emit('update:form', { ...props.form, [key]: val })
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-up overflow-hidden">
      <header class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 class="text-xl font-bold text-gray-900">
            {{ isEditing ? t.modal_activity_edit : t.modal_activity_add }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">{{ t.modal_activity_subtitle }}</p>
        </div>
        <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors">✕</button>
      </header>

      <div class="p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <UiInput
          :model-value="form.title"
          @update:model-value="v => update('title', v)"
          :label="t.label_activity_name"
        />

        <div class="grid grid-cols-2 gap-5">
          <UiInput
            :model-value="form.start_time"
            @update:model-value="v => update('start_time', v)"
            :label="t.label_start_time"
            type="time"
          />
          <UiInput
            :model-value="form.end_time"
            @update:model-value="v => update('end_time', v)"
            :label="t.label_end_time"
            type="time"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            {{ t.label_select_icon }}
          </label>
          <div class="grid grid-cols-5 gap-3">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              @click="update('icon', icon)"
              :class="[
                'h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 shadow-sm',
                form.icon === icon
                  ? 'bg-accent text-white ring-4 ring-orange-100 scale-110'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              ]"
            >
              {{ icon }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <UiInput
            :model-value="form.location"
            @update:model-value="v => update('location', v)"
            :label="t.label_location_timeline"
          />
          <UiTextarea
            :model-value="form.description"
            @update:model-value="v => update('description', v)"
            :label="t.label_desc_timeline"
            rows="3"
          />
        </div>
      </div>

      <footer class="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <UiButton variant="secondary" @click="$emit('close')">{{ t.cancel }}</UiButton>
        <UiButton variant="primary" @click="$emit('save')">{{ t.save }}</UiButton>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
