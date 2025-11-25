export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = Number(query.eventId)
  if (!eventId) return []
  
  return await prisma.expense.findMany({
    where: { eventId: eventId },
    orderBy: { date: 'desc' }
  })
})