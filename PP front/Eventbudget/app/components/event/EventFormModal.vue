<script setup>
import { reactive, watch } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'

const props = defineProps({
  show: Boolean,
  event: Object,
  isEditing: Boolean
})

const emits = defineEmits(['close', 'save'])

// ฟอร์มที่ตรงกับตาราง events ใน Database
const form = reactive({
  id: null,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  client_name: '',
  location: '',
  total_budget: null,
  venue_name: '',
  venue_url: '',
  accommodation_name: '',
  accommodation_url: '',
  drive_link: '',
})

// โหลดข้อมูลเข้าฟอร์มเมื่อกดแก้ไข
watch(() => props.event, (e) => {
  if (e) {
    form.id = e.id ?? null
    form.name = e.name ?? ''
    form.description = e.description ?? ''
    form.start_date = e.start_date ? e.start_date.split('T')[0] : '' // แปลง format วันที่ถ้าจำเป็น
    form.end_date = e.end_date ? e.end_date.split('T')[0] : ''
    form.client_name = e.client_name ?? ''
    form.location = e.location ?? ''
    form.total_budget = e.total_budget ?? null
    form.venue_name = e.venue_name ?? ''
    form.venue_url = e.venue_url ?? ''
    form.accommodation_name = e.accommodation_name ?? ''
    form.accommodation_url = e.accommodation_url ?? ''
    form.drive_link = e.drive_link ?? ''
  } else {
    // Reset form for create mode
    Object.keys(form).forEach(key => form[key] = key === 'total_budget' ? null : '')
  }
}, { immediate: true })

const close = () => emits('close')
const save = () => emits('save', { ...form })
</script>

<template>
  <div v-if="show" class="fixed inset-0 flex items-start justify-center p-4 pt-10 z-[100] bg-black/50 backdrop-blur-sm overflow-y-auto">
    
    <div class="relative w-full max-w-2xl bg-white text-text-primary rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
      
      <header class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'แก้ไขอีเวนต์' : 'เพิ่มอีเวนต์ใหม่' }}
        </h3>
        <button @click="close" class="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
      </header>

      <div class="p-6 space-y-4 overflow-y-auto">
        <UiInput v-model="form.name" label="ชื่ออีเวนต์ (Event Name)" placeholder="เช่น Tech Conference 2024" />
        
        <UiTextarea v-model="form.description" label="รายละเอียด (Description)" rows="3" />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.start_date" label="วันที่เริ่มต้น" type="date" />
          <UiInput v-model="form.end_date" label="วันสิ้นสุด" type="date" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.client_name" label="ลูกค้า (Client Name)" />
          <UiInput v-model="form.location" label="สถานที่/ประเทศ (Location)" />
        </div>

        <UiInput v-model.number="form.total_budget" label="งบประมาณทั้งหมด (Total Budget)" type="number" placeholder="0.00" />
        
        <hr class="border-gray-200 my-2" />
        
        <h4 class="text-md font-semibold text-gray-800">สถานที่จัดงาน (Venue)</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.venue_name" label="ชื่อสถานที่" />
          <UiInput v-model="form.venue_url" label="ลิงก์สถานที่ (URL)" placeholder="https://..." />
        </div>
        
        <h4 class="text-md font-semibold text-gray-800">ที่พัก (Accommodation)</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.accommodation_name" label="ชื่อที่พัก" />
          <UiInput v-model="form.accommodation_url" label="ลิงก์ที่พัก (URL)" placeholder="https://..." />
        </div>
        
        <hr class="border-gray-200 my-2" />
        
        <UiInput v-model="form.drive_link" label="ลิงก์ไฟล์งาน (Google Drive)" placeholder="https://drive.google.com/..." />
      </div>

      <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <UiButton variant="secondary" @click="close">ยกเลิก</UiButton>
        <UiButton variant="primary" @click="save">
          {{ isEditing ? 'บันทึก' : 'สร้าง' }}
        </UiButton>
      </footer>
    </div>
  </div>
</template>