<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  form: { type: Object, required: true },
  t: { type: Object, required: true }
})

const emit = defineEmits(['close', 'save', 'update:form'])

const update = (key, val) => {
  emit('update:form', { ...props.form, [key]: val })
}
</script>

<template>
  <div v-if="open"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-scale-up">
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 bg-orange-50 text-accent rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          📅</div>
        <h3 class="text-2xl font-bold text-gray-900">{{ t.modal_day_title }}</h3>
        <p class="text-sm text-gray-500">{{ t.modal_day_subtitle }}</p>
      </div>

      <div class="space-y-5">
        <UiInput :model-value="form.date" @update:model-value="v => update('date', v)" :label="t.label_event_date"
          type="date" />
        <UiInput :model-value="form.title" @update:model-value="v => update('title', v)" :label="t.label_theme_title" />
      </div>

      <div class="grid grid-cols-2 gap-3 mt-8">
        <button type="button" @click="$emit('close')"
          class="w-full px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition">
          {{ t.cancel }}
        </button>

        <button type="button" @click="$emit('save')"
          class="w-full bg-[#F47A27] text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-[#d96b22] active:scale-95 transition-all text-sm font-semibold">
          {{ t.save }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
