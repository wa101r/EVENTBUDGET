<script setup lang="ts">
const { data, pending, error } = await useFetch(
  'http://localhost/EventBudget/api/test-api.php'
)

// ดู error ใน console ถ้ามี
if (error.value) {
  console.error('API ERROR:', error.value)
}
</script>


<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">หน้า Test เชื่อม Backend</h1>

    <div v-if="pending">
      กำลังเรียก PHP backend...
    </div>

    <div v-else-if="error">
      ❌ เรียก API ไม่ได้ ลองตรวจสอบอีกที
    </div>

    <div v-else>
      <p>success: {{ data.success }}</p>
      <p>message: {{ data.message }}</p>
    </div>
  </div>
</template>
