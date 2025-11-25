export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.scheduleItem.delete({ where: { id: Number(query.id) } })
})