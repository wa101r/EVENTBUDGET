export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.eventDay.delete({ where: { id: Number(query.id) } })
})