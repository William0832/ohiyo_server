import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const fetchUser = async (lineId) => {
  const user = await prisma.user.findFirst({ where: { lineId } })
  if (user == null) {
    return
  }
  return user
}
const createUser = async (data) => {
  const user = await prisma.user.create({ data })
  if (user == null) {
    console.warn('createUser fail')
    return
  }
  return user
}
export default {
  fetchUser, createUser
}
