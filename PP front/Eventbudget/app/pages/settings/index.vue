<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
// definePageMeta({ layout: 'default' }) // ⭐️ ลบออก
</script>
<template>
  <NuxtLayout name="default">
    <template #header-title>ตั้งค่าทั่วไป</template>
    
    <div>
      <UiCard class="max-w-2xl space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-2 text-text-primary">ภาษา</h2>
          <div class="flex gap-2">
            <UiButton variant="primary">ไทย</UiButton>
            <UiButton variant="secondary">อังกฤษ</UiButton>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-2 text-text-primary">พื้นหลังแอป</h2>
          <UiButton variant="secondary">อัปโหลดภาพ</UiButton>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-2 text-text-primary">สำรองและกู้คืนข้อมูล</h2>
          <div class="flex gap-2">
            <UiButton variant="secondary">สำรองข้อมูล</UiButton>
            <UiButton variant="secondary">กู้คืนข้อมูล</UiButton>
          </div>
        </div>
      </UiCard>
    </div>
  </NuxtLayout>
</template>