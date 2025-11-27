<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'save'])
const inputRef = ref(null)

// เก็บข้อมูลฟอร์ม
const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0], // Default วันนี้
  time: ''
})

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 100)
})

const submit = () => {
  if (!form.value.title.trim()) return
  
  // ส่งข้อมูลทั้งก้อนออกไป
  emit('save', { 
    title: form.value.title,
    due_date: form.value.date,
    due_time: form.value.time
  })

  // รีเซ็ตค่า
  form.value.title = ''
  form.value.time = ''
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
    
    <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 scale-100 transition-transform">
      <h3 class="text-lg font-bold text-slate-800 mb-4">✨ เพิ่มงานใหม่</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 mb-1">สิ่งที่ต้องทำ</label>
          <input 
            ref="inputRef"
            v-model="form.title" 
            type="text" 
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none shadow-sm" 
            placeholder="เช่น จองโรงแรม..." 
            @keyup.enter="submit"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">วันที่กำหนด</label>
            <input 
              v-model="form.date" 
              type="date" 
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">เวลา (ถ้ามี)</label>
            <input 
              v-model="form.time" 
              type="time" 
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" 
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6 pt-2">
        <button @click="$emit('close')" class="flex-1 px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition">ยกเลิก</button>
        <button @click="submit" class="flex-1 px-4 py-2.5 rounded-xl text-white bg-orange-500 hover:bg-orange-600 text-sm font-semibold shadow-lg shadow-orange-200 transition transform active:scale-95">เพิ่มงาน</button>
      </div>
    </div>
  </div>
</template>