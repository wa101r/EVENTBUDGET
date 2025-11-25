

export default defineEventHandler(async (event) => {
  try {
    // ดึงข้อมูลจาก DB จริง (เรียงจากใหม่ -> เก่า)
    const events = await prisma.event.findMany({
      orderBy: { id: 'desc' }
    })
    return events
  } catch (error) {
    console.error('Database Error:', error)
    return []
  }
})