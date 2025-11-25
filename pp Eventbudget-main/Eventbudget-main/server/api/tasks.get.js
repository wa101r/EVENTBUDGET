export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = Number(query.eventId)
  if (!eventId) return []
  
  return await prisma.task.findMany({
    where: { eventId: eventId },
    orderBy: { id: 'desc' }
  })
})