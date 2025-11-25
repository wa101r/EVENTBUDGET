export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.task.update({
    where: { id: body.id },
    data: { is_completed: body.is_completed }
  })
})