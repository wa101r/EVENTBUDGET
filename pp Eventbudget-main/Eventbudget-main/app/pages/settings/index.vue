<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'

const { t, locale, setLocale } = useAppLocale()

// --- 1. Logic สำหรับ Background Image ---
const bgInput = ref(null)

const triggerBgUpload = () => {
  bgInput.value.click()
}

const handleBgUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // แปลงไฟล์รูปเป็น Base64 เพื่อบันทึกใน LocalStorage (ง่ายและเร็วสำหรับ App ขนาดเล็ก)
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target.result
    // 1. บันทึก
    localStorage.setItem('app_bg_image', result)
    // 2. แสดงผลทันที
    document.body.style.backgroundImage = `url('${result}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
    alert('เปลี่ยนพื้นหลังเรียบร้อย!')
  }
  // จำกัดขนาดไฟล์ไม่เกิน 2MB กัน LocalStorage เต็ม
  if (file.size > 2 * 1024 * 1024) {
    alert('ขนาดไฟล์ต้องไม่เกิน 2MB')
    return
  }
  reader.readAsDataURL(file)
}

// --- 2. Logic สำหรับ Backup ---
const downloadBackup = async () => {
  try {
    // เรียก API
    const data = await $fetch('/api/settings/backup')
    
    // สร้างไฟล์ JSON แล้วสั่งโหลด
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eventbudget-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการสำรองข้อมูล')
    console.error(error)
  }
}

// --- 3. Logic สำหรับ Restore ---
const restoreInput = ref(null)

const triggerRestore = () => {
  if(confirm('คำเตือน! การกู้คืนข้อมูลจะ "ลบข้อมูลปัจจุบันทั้งหมด" คุณแน่ใจหรือไม่?')) {
    restoreInput.value.click()
  }
}

const handleRestore = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      
      // ส่งไป Server
      await $fetch('/api/settings/restore', {
        method: 'POST',
        body: jsonData
      })
      
      alert('กู้คืนข้อมูลสำเร็จ! ระบบจะรีโหลดหน้าจอ')
      window.location.reload()
    } catch (error) {
      alert('ไฟล์ไม่ถูกต้อง หรือเกิดข้อผิดพลาดที่ Server')
      console.error(error)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.headerTitle }}</template>
    
    <div>
      <input type="file" ref="bgInput" accept="image/*" class="hidden" @change="handleBgUpload" />
      <input type="file" ref="restoreInput" accept=".json" class="hidden" @change="handleRestore" />

      <UiCard class="max-w-2xl space-y-8 p-6">
        
        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.language }}
          </h2>
          <div class="flex gap-3 pl-4">
            <UiButton @click="setLocale('th')" :variant="locale === 'th' ? 'primary' : 'secondary'" class="min-w-[100px]">
              🇹🇭 ไทย
            </UiButton>
            <UiButton @click="setLocale('en')" :variant="locale === 'en' ? 'primary' : 'secondary'" class="min-w-[100px]">
              🇬🇧 English
            </UiButton>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.appBackground }}
          </h2>
          <div class="pl-4">
             <UiButton variant="secondary" class="flex items-center gap-2" @click="triggerBgUpload">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                {{ t.uploadImage }}
             </UiButton>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.backupRestore }}
          </h2>
          <div class="flex gap-3 pl-4">
            <UiButton variant="secondary" class="flex items-center gap-2" @click="downloadBackup">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
               </svg>
               {{ t.backup }}
            </UiButton>
            <UiButton variant="secondary" class="flex items-center gap-2" @click="triggerRestore">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
               </svg>
               {{ t.restore }}
            </UiButton>
          </div>
        </div>

      </UiCard>
    </div>
  </NuxtLayout>
</template>