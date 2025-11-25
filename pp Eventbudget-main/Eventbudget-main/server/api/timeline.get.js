export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = Number(query.eventId)
  if (!eventId) return []

  // ดึงวัน และ กิจกรรมข้างในมาพร้อมกัน (include items)
  return await prisma.eventDay.findMany({
    where: { eventId: eventId },
    include: { items: true },
    orderBy: { date: 'asc' }
  })
})