export default defineEventHandler(async () => {
  return await $fetch("http://eventbudget_app:8000/api/events")
})
