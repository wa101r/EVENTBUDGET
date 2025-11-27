<script setup>
import { ref, watch, computed } from 'vue';
import FormField from '~/components/FormField.vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
});

const emit = defineEmits(['save', 'close']);

const form = ref({
  name: '',
  amount: '',
  category: '',
  date: '',
  time: '',
});

watch(() => props.initialData, (val) => {
  if (val) {
    form.value = {
      name: val.name || '',
      amount: val.amount || '',
      category: val.category || '',
      date: val.date || '',
      time: val.time || val.start_time || '',
    };
  } else {
    form.value = {
      name: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
    };
  }
}, { immediate: true });

const isEditing = computed(() => !!props.initialData);

const save = () => {
  emit('save', form.value);
};
</script>

<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div class="flex justify-between items-center px-6 py-4 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-900">
          {{ isEditing ? "Edit Expense" : "Add Expense" }}
        </h2>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-transform hover:rotate-90">
          ✕
        </button>
      </div>

      <form @submit.prevent="save" class="px-6 py-5 space-y-4">
        <FormField label="Item Name">
          <input v-model="form.name" class="form-input-light" placeholder="e.g. Catering deposit" required />
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField label="Amount">
            <input v-model="form.amount" type="number" step="0.01" class="form-input-light" required />
          </FormField>
          <FormField label="Category">
            <select v-model="form.category" class="form-input-light">
              <option value="">-- Select --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <FormField label="Date">
            <input v-model="form.date" type="date" class="form-input-light" />
          </FormField>
          <FormField label="Time">
            <input v-model="form.time" type="time" class="form-input-light" />
          </FormField>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
          <button type="button" @click="emit('close')" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 hover:-translate-y-0.5 transition-all">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 bg-[#F47A27] text-white rounded-lg shadow-sm hover:bg-[#d96b22] hover:-translate-y-0.5 transition-all">
            {{ isEditing ? "Update" : "Save" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-input-light {
  @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition;
}
</style>