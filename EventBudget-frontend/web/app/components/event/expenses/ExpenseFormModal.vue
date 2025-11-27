<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  initialData: Object,
  // รับ Categories ที่โหลดมาจาก DB (ผ่าน Parent)
  categories: { type: Array, default: () => [] } 
})

const emit = defineEmits(['close', 'save'])

// ฟังก์ชันช่วยดึงเวลาปัจจุบันในรูปแบบ "HH:mm"
const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// ตั้งค่าเริ่มต้นของฟอร์ม
const form = ref({
  name: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0], // วันที่ปัจจุบัน
  time: getCurrentTime() // ✅ เวลาปัจจุบัน
})

onMounted(() => {
  // กรณีแก้ไขรายการ (Edit)
  if (props.initialData) {
    form.value = { ...props.initialData }
    
    // ถ้าข้อมูลเก่าไม่มีเวลา (หรือเป็น null) ให้ใส่เวลาปัจจุบันเข้าไปแทน (จะได้ไม่โล่ง)
    if (!form.value.time) {
      form.value.time = getCurrentTime()
    }
  }
})

const submit = () => {
  if (!form.value.name || !form.value.amount) {
    return alert('กรุณากรอกชื่อรายการและจำนวนเงิน')
  }
  emit('save', form.value)
}
</script>

<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative bg-white w-full max-w-md rounded-3xl shadow-xl p-6 transition-all transform scale-100">
      <h3 class="text-lg font-bold text-slate-800 mb-4">
        {{ initialData ? 'แก้ไขรายการ' : 'เพิ่มรายจ่าย' }}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 mb-1">รายการ</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" 
            placeholder="เช่น ค่าสถานที่..." 
            autofocus 
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">จำนวนเงิน</label>
            <input 
              v-model="form.amount" 
              type="number" 
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" 
              placeholder="0.00" 
            />
          </div>
          
          <div>
             <label class="block text-xs font-semibold text-slate-500 mb-1">หมวดหมู่</label>
             <select 
               v-model="form.category" 
               class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none bg-white"
             >
                <option value="">ไม่ระบุ</option>
                <option 
                  v-for="cat in categories" 
                  :key="cat.id" 
                  :value="cat.name"
                >
                  {{ cat.name }}
                </option>
             </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
             <label class="block text-xs font-semibold text-slate-500 mb-1">วันที่</label>
             <input 
               v-model="form.date" 
               type="date" 
               class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" 
             />
          </div>
          <div>
             <label class="block text-xs font-semibold text-slate-500 mb-1">เวลา</label>
             <input 
               v-model="form.time" 
               type="time" 
               class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" 
             />
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6 pt-4 border-t border-slate-100">
        <button 
          @click="$emit('close')" 
          class="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition"
        >
          ยกเลิก
        </button>
        <button 
          @click="submit" 
          class="flex-1 px-4 py-2.5 rounded-xl text-white bg-orange-500 hover:bg-orange-600 text-sm font-semibold shadow-lg shadow-orange-200 transition active:scale-95"
        >
          บันทึก
        </button>
      </div>
    </div>
  </div>
</template>