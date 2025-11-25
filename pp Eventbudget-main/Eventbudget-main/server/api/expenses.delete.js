export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.expense.delete({ where: { id: Number(query.id) } })
})