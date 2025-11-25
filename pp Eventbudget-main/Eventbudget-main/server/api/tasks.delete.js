export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.task.delete({ where: { id: Number(query.id) } })
})