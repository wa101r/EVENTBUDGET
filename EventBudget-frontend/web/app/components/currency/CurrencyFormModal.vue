<script setup lang="ts">
import { reactive, watch, computed, unref } from "vue"

const props = defineProps<{
  isOpen: boolean | any
  isEditing: boolean | any
  form: { code: string; name: string } | any
  previewLiveRateForForm: string | number | null | any
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "save"): void
  (e: "update:form", v: { code: string; name: string }): void
}>()

const open = computed(() => !!unref(props.isOpen))
const editing = computed(() => !!unref(props.isEditing))

const localForm = reactive({ code: "", name: "" })

watch(
  () => unref(props.form),
  (v) => {
    localForm.code = (v?.code || "")
    localForm.name = (v?.name || "")
  },
  { immediate: true, deep: true }
)

watch(
  () => ({ ...localForm }),
  (v) => emit("update:form", { code: v.code, name: v.name }),
  { deep: true }
)

const previewText = computed(() => {
  const p = unref(props.previewLiveRateForForm)
  if (p == null || p === "") return null
  return String(p)
})
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ editing ? "Edit Currency" : "Add Currency" }}
        </h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-700">✕</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-sm text-slate-600">Code</label>
          <input
            v-model="localForm.code"
            type="text"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase outline-none
                   focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="เช่น THB, USD"
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">Name</label>
          <input
            v-model="localForm.name"
            type="text"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none
                   focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="ชื่อเต็มของสกุลเงิน"
          />
        </div>

        <div
          v-if="previewText"
          class="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700"
        >
          Preview จาก live rate:
          <span class="font-semibold">1 {{ localForm.code.toUpperCase() }} ≈ {{ previewText }} THB</span>
        </div>
      </div>

      <div class="pt-2 flex justify-end gap-3">
        <button class="text-sm text-slate-500 hover:text-slate-700" @click="emit('close')">
          Cancel
        </button>
        <button
          class="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 active:scale-95"
          @click="emit('save')"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
