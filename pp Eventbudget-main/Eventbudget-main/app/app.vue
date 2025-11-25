<script setup>
import { onMounted } from 'vue'

// Logic โหลดรูปพื้นหลัง (ถ้ามี)
onMounted(() => {
  const savedBg = localStorage.getItem('app_bg_image')
  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundPosition = 'center'
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>