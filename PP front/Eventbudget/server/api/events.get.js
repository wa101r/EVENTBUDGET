import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  // ⭐️ แนะนำให้เปลี่ยน Path เป็น 'server/data/events.json'
  const filePath = join(process.cwd(), 'server/data/events.json')
  const json = await readFile(filePath, 'utf8')

  return JSON.parse(json)
})