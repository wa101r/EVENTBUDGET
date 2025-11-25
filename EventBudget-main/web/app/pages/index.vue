<script setup>
definePageMeta({
  layout: 'default',
  title: 'Event Management'
})

const router = useRouter()

onMounted(() => {
  router.replace('event-manage/eventname')
})
</script>

<template>
  <div></div>
</template>
