<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'header',
  title: 'Expense Categories'
})

const API_URL = 'http://127.0.0.1:8000/api/categories'

// โหลดรายการหมวดหมู่
const { data, pending, error, refresh } = await useFetch(API_URL)

const categories = computed<any[]>(() => {
  const raw = data.value as any
  return (raw && (raw.data ?? raw)) || []
})

// ----- STATE MODAL -----
const isOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  name: '',
  icon: ''
})

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', icon: '' }
  isOpen.value = true
}

const openEdit = (cat: any) => {
  isEditing.value = true
  editingId.value = cat.id
  form.value = {
    name: cat.name ?? '',
    icon: cat.icon ?? ''
  }
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const saveCategory = async () => {
  if (!form.value.name.trim()) return

  try {
    if (isEditing.value && editingId.value !== null) {
      await $fetch(`${API_URL}/${editingId.value}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch(API_URL, {
        method: 'POST',
        body: form.value
      })
    }

    await refresh()
    isOpen.value = false
  } catch (err) {
    console.error('Failed to save category', err)
  }
}

const deleteCategory = async (cat: any) => {
  if (!confirm(`Delete category "${cat.name}" ?`)) return

  try {
    await $fetch(`${API_URL}/${cat.id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (err) {
    console.error('Failed to delete category', err)
  }
}
</script>

<template>
  <!-- ทำให้สูงอย่างน้อยเต็มจอ / ใช้ได้แบบแอพ -->
  <div class="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-4 md:px-6 md:py-6">
    <div class="mx-auto w-full max-w-4xl space-y-4 md:space-y-6">

      <!-- HEADER -->
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-slate-800 md:text-2xl">
            Expense Categories
          </h1>
          <p class="text-xs text-slate-500 md:text-sm">
            จัดการหมวดหมู่ค่าใช้จ่ายสำหรับใช้งานในแต่ละอีเวนต์
          </p>
        </div>

        <!-- ปุ่ม Add บน desktop / tablet -->
        <button
          @click="openAdd"
          class="hidden md:inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 active:scale-[0.98] transition"
        >
          + Add Category
        </button>
      </div>

      <!-- MAIN CARD -->
      <div
        class="rounded-2xl bg-white p-3 shadow-sm md:p-4 min-h-[240px] flex flex-col"
      >
        <!-- Loading / Error / Empty -->
        <div v-if="pending" class="flex-1 py-10 text-center text-sm text-slate-400">
          Loading categories...
        </div>

        <div v-else-if="error" class="flex-1 py-10 text-center text-sm text-red-500">
          ไม่สามารถโหลดข้อมูลได้
        </div>

        <div
          v-else-if="categories.length === 0"
          class="flex-1 py-10 flex flex-col items-center justify-center space-y-3 text-center"
        >
          <div
            class="inline-flex items-center rounded-full bg-orange-50 px-4 py-1 text-sm font-medium text-orange-500"
          >
            Expense Categories
          </div>
          <p class="text-xs text-slate-500 md:text-sm">
            ยังไม่มีหมวดหมู่ค่าใช้จ่าย ลองเพิ่มหมวดแรกดูก่อน
          </p>
          <button
            @click="openAdd"
            class="mt-1 inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 active:scale-[0.98] transition"
          >
            + Add Category
          </button>
        </div>

        <!-- LIST -->
        <div
          v-else
          class="flex-1 space-y-2 overflow-y-auto pt-1 md:space-y-3 md:pt-2"
        >
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-sm md:text-base hover:bg-orange-100 transition active:scale-[0.99]"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl md:text-2xl">
                {{ cat.icon || '📁' }}
              </span>
              <span class="font-medium text-slate-800">
                {{ cat.name }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-slate-500">
              <button
                @click="openEdit(cat)"
                class="rounded-full p-1.5 hover:bg-white/80 hover:text-slate-700 active:scale-95"
                title="Edit"
              >
                ✎
              </button>
              <button
                @click="deleteCategory(cat)"
                class="rounded-full p-1.5 hover:bg-white/80 hover:text-red-600 active:scale-95"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB: ปุ่มลอยสำหรับมือถือ -->
    <button
      @click="openAdd"
      class="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-2xl text-white shadow-lg active:scale-95 md:hidden"
      aria-label="Add Category"
    >
      +
    </button>

    <!-- MODAL -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <!-- กล่อง modal ปรับให้ใช้ได้ทั้ง mobile / desktop -->
      <div
        class="w-full max-w-md rounded-t-2xl bg-white p-5 pb-6 shadow-xl md:rounded-2xl md:p-6"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800 md:text-lg">
            {{ isEditing ? 'Edit Category' : 'Add Category' }}
          </h2>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-slate-600 active:scale-95"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Category Name
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="เช่น Catering, Venue, Marketing"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Icon (e.g., 🍔)
            </label>
            <input
              v-model="form.icon"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="ใส่ emoji หรือปล่อยว่างก็ได้"
            />
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="text-xs text-slate-500 hover:text-slate-700 md:text-sm"
          >
            Cancel
          </button>
          <button
            @click="saveCategory"
            class="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 active:scale-95 md:text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
