<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
// เรียกใช้ Composable เดียวที่รวมทุกอย่างไว้
import { useExpensesApi } from '~/composables/useExpensesApi'

const route = useRoute()
const eventId = route.params.id
const { getExpensesByEventId, addExpense, updateExpense, removeExpense, categories } = useExpensesApi()

// ดึงข้อมูล (เป็น Computed Ref)
const expenses = getExpensesByEventId(eventId)

const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', amount: null, date: '', time: '', category: '' })

// --- Helper: จัดกลุ่มข้อมูลตามวันที่ ---
const expensesGrouped = computed(() => {
  const groups = {}
  // ต้องใช้ .value เพราะ expenses เป็น computed
  expenses.value.forEach(item => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
  })
  // เรียงวันที่ (ใหม่ -> เก่า)
  return Object.keys(groups).sort().reverse().map(date => ({
    date,
    items: groups[date]
  }))
})

// --- Helper: ยอดรวม ---
const totalAmount = computed(() => {
  return expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
})

// --- Helper: หาไอคอน (ใช้ใน UI) ---
const getCategoryIcon = (catName) => {
  const found = categories.value.find(c => c.name === catName)
  return found ? found.icon : '🧾'
}

// --- Modal Logic ---
const openCreate = () => {
  isEditing.value = false
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  
  form.value = { 
    id: null, name: '', amount: null, 
    date: today, time: now, 
    category: categories.value[0]?.name || '' 
  }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  // Clone object เพื่อไม่ให้แก้ข้อมูลจริงทันที
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (!form.value.name || !form.value.amount) {
    alert('กรุณากรอกชื่อรายการและจำนวนเงิน')
    return
  }

  const payload = { ...form.value, event_id: Number(eventId) }

  if (isEditing.value) {
    updateExpense(payload)
  } else {
    addExpense(payload)
  }
  isModalOpen.value = false
}

const handleDelete = (id) => {
  if(confirm('ต้องการลบรายการค่าใช้จ่ายนี้ใช่หรือไม่?')) {
    removeExpense(id)
  }
}
</script>

<template>
  <NuxtLayout name="event">
    
    <div class="max-w-4xl mx-auto py-2">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 class="text-2xl font-bold text-text-primary">ติดตามค่าใช้จ่าย</h2>
        <div class="bg-white px-5 py-3 rounded-xl border border-base-border shadow-sm flex items-center gap-3">
          <div class="bg-orange-100 p-2 rounded-full text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-text-secondary font-medium uppercase tracking-wide">รวมทั้งหมด</p>
            <p class="text-xl font-bold text-accent">
              ฿{{ totalAmount.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="expenses.length === 0" class="text-center text-text-secondary py-20 flex flex-col items-center bg-white rounded-xl border-2 border-dashed border-base-border">
        <div class="text-6xl mb-4 opacity-50 grayscale">💸</div>
        <p class="text-lg font-medium text-gray-900">ยังไม่มีรายการค่าใช้จ่าย</p>
        <p class="text-sm mb-6 text-gray-500">เริ่มบันทึกค่าใช้จ่ายแรกของคุณเพื่อติดตามงบประมาณ</p>
        <UiButton variant="primary" @click="openCreate">
          + บันทึกค่าใช้จ่าย
        </UiButton>
      </div>

      <div v-else class="space-y-8 pb-24">
        <div v-for="group in expensesGrouped" :key="group.date">
          
          <h3 class="sticky top-[64px] z-10 bg-base-bg/95 backdrop-blur py-3 text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-transparent">
            <span class="w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-orange-100"></span>
            {{ new Date(group.date).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
          </h3>

          <div class="space-y-3">
            <div 
              v-for="expense in group.items" 
              :key="expense.id" 
              class="group bg-white rounded-xl border border-base-border hover:border-accent hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row overflow-hidden relative"
            >
              
              <div class="flex-1 p-4 flex items-center gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-200">
                  {{ getCategoryIcon(expense.category) }}
                </div>

                <div class="min-w-0 flex-1">
                  <h4 class="font-bold text-text-primary text-lg truncate">{{ expense.name }}</h4>
                  <div class="flex items-center flex-wrap gap-2 text-sm text-text-secondary mt-1">
                    <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium border border-gray-200">
                      {{ expense.category }}
                    </span>
                    <span class="flex items-center gap-1 text-xs">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {{ expense.time }} น.
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-4 p-4 sm:border-l border-t sm:border-t-0 border-base-border bg-gray-50/50 min-w-[160px]">
                <div class="text-right flex-1 sm:flex-none">
                  <div class="text-lg font-bold text-text-primary">฿{{ Number(expense.amount).toLocaleString() }}</div>
                </div>

                <div class="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button @click="openEdit(expense)" class="p-2 text-gray-500 hover:text-accent hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-200" title="แก้ไข">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="handleDelete(expense.id)" class="p-2 text-gray-500 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-200" title="ลบ">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8 shadow-xl z-50" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center sm:items-start justify-center p-4 sm:pt-20 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-md bg-white text-text-primary rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
        
        <header class="flex items-center justify-between px-6 py-4 border-b border-base-border">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'แก้ไขรายการ' : 'บันทึกค่าใช้จ่าย' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-text-primary text-2xl transition-colors">✕</button>
        </header>
        
        <div class="p-6 space-y-5">
          <UiInput v-model="form.name" label="ชื่อรายการ" placeholder="เช่น ค่าอาหารกลางวัน, ค่าเช่าสถานที่" />
          
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (THB)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 font-bold">฿</span>
              </div>
              <input type="number" v-model.number="form.amount" class="w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none text-lg font-semibold text-gray-900 placeholder-gray-400 transition-shadow" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
            <div class="grid grid-cols-4 gap-2">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="form.category = cat.name"
                :class="['flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200', form.category === cat.name ? 'border-accent bg-orange-50 text-accent shadow-sm scale-105' : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-500 hover:border-gray-300']"
              >
                <span class="text-2xl mb-1">{{ cat.icon }}</span>
                <span class="text-[10px] font-medium truncate w-full text-center">{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UiInput v-model="form.date" label="วันที่" type="date" />
            <UiInput v-model="form.time" label="เวลา" type="time" />
          </div>
        </div>

        <footer class="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-border bg-gray-50 rounded-b-2xl">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ isEditing ? 'บันทึกการแก้ไข' : 'บันทึก' }}</UiButton>
        </footer>

      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>