<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick, type CSSProperties } from "vue"
import { currencyMeta, getCurrencyLabel } from "~/shared/currencyMeta"

const props = defineProps<{
  modelValue: string
  codes: string[]
  search: string
  isOpen: boolean
  placeholder?: string
}>()

const emit = defineEmits([
  "update:modelValue",
  "update:search",
  "update:isOpen",
])

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const openUp = ref(false)
const dropdownStyle = ref<CSSProperties>({})

// --- ส่วนจัดการรูปธง (แก้ใหม่) ---

// ฟังก์ชันดึง URL รูปธงจาก FlagCDN
const getFlagUrl = (code: string) => {
  const c = (code || "").toUpperCase()
  const meta = currencyMeta[c]
  
  // กรณีพิเศษ: EUR ไม่มี countryCode ใน meta บางเวอร์ชัน ให้ใช้ 'eu'
  if (c === 'EUR') return 'https://flagcdn.com/w80/eu.png'

  // ถ้ามี countryCode ให้ดึงรูปจาก CDN
  if (meta?.countryCode) {
    return `https://flagcdn.com/w80/${meta.countryCode.toLowerCase()}.png`
  }
  
  return null // ถ้าไม่มีรูป จะไปใช้ Emoji แทน
}

// Fallback: ถ้าไม่มีรูป ให้ใช้ Emoji หรือ 🌐 เหมือนเดิม
const getFlagEmojiFallback = (code: string) => {
  const c = (code || "").toUpperCase()
  const meta = currencyMeta[c]
  return meta?.emoji || "🌐"
}
// ------------------------------

const selected = computed(() => (props.modelValue || "").toUpperCase())

const close = () => emit("update:isOpen", false)
const toggle = async () => {
  const next = !props.isOpen
  emit("update:isOpen", next)

  if (next) {
    await nextTick()
    calcOpenDirection()
  }
}

const filteredCodes = computed(() => {
  const q = (props.search || "").trim().toLowerCase()
  if (!q) return props.codes
  return props.codes.filter(code => {
    const lbl = (getCurrencyLabel(code) || "").toLowerCase()
    return code.toLowerCase().includes(q) || lbl.includes(q)
  })
})

const pick = (code: string) => {
  emit("update:modelValue", code)
  close()
}

const calcOpenDirection = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const viewportH = window.innerHeight

  const spaceBelow = viewportH - rect.bottom
  const spaceAbove = rect.top

  const isUp = spaceBelow < 260 && spaceAbove > spaceBelow
  openUp.value = isUp

  dropdownStyle.value = {
    position: 'fixed',
    zIndex: 9999,
    width: `${rect.width}px`,
    left: `${rect.left}px`,
    top: isUp ? 'auto' : `${rect.bottom + 4}px`,
    bottom: isUp ? `${viewportH - rect.top + 4}px` : 'auto',
  }
}

const onDocClick = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (rootRef.value && rootRef.value.contains(t)) return
  close()
}

onMounted(() => {
  document.addEventListener("click", onDocClick)
  window.addEventListener("resize", calcOpenDirection)
  window.addEventListener("scroll", calcOpenDirection, true)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick)
  window.removeEventListener("resize", calcOpenDirection)
  window.removeEventListener("scroll", calcOpenDirection, true)
})

watch(
  () => props.isOpen,
  async (v) => {
    if (v) {
      await nextTick()
      calcOpenDirection()
    }
  }
)
</script>

<template>
  <div ref="rootRef" class="relative inline-block w-full">
    <button
      ref="triggerRef"
      type="button"
      @click.stop="toggle"
      class="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5
             flex items-center justify-between gap-2 text-left
             hover:bg-slate-50 active:scale-[0.99]
             focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
          <img 
            v-if="getFlagUrl(selected)" 
            :src="getFlagUrl(selected)" 
            class="h-full w-full object-cover" 
            alt="flag" 
          />
          <span v-else class="text-lg">{{ getFlagEmojiFallback(selected) }}</span>
        </div>

        <div class="min-w-0">
          <div class="text-sm font-semibold text-slate-900 truncate">
            {{ selected }}
          </div>
          <div class="text-[11px] text-slate-500 truncate">
            {{ getCurrencyLabel(selected) }}
          </div>
        </div>
      </div>

      <span class="text-xs text-slate-400 shrink-0">▾</span>
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="props.isOpen"
          @click.stop
          class="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
          :style="{ ...dropdownStyle, maxHeight: '280px' }"
        >
          <div class="p-2 border-b border-slate-100" @click.stop>
            <input
              :value="props.search"
              @input="emit('update:search', ($event.target as HTMLInputElement).value)"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none
                     focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              :placeholder="props.placeholder || 'ค้นหา...'"
            />
          </div>

          <div class="max-h-[240px] overflow-y-auto py-1">
            <button
              v-for="code in filteredCodes"
              :key="code"
              type="button"
              @click="pick(code)"
              class="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-slate-50"
              :class="code.toUpperCase() === selected ? 'bg-orange-50/60' : ''"
            >
              <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                <img 
                  v-if="getFlagUrl(code)" 
                  :src="getFlagUrl(code)" 
                  class="h-full w-full object-cover" 
                  loading="lazy"
                  alt="flag" 
                />
                <span v-else class="text-lg">{{ getFlagEmojiFallback(code) }}</span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-slate-900 truncate">
                  {{ code.toUpperCase() }}
                </div>
                <div class="text-[11px] text-slate-500 truncate">
                  {{ getCurrencyLabel(code) }}
                </div>
              </div>

              <div class="text-orange-500 text-sm shrink-0">
                <span v-if="code.toUpperCase() === selected">✓</span>
              </div>
            </button>

            <div v-if="filteredCodes.length === 0" class="px-3 py-3 text-xs text-slate-400">
              ไม่พบสกุลเงินที่ค้นหา
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>