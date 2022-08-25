import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const fetchUser = async (lineId) => {
  const user = await prisma.user.findFirst({ where: { lineId } } )
  if(user == null) console.log('fetchUser fail')
  console.log('fetchUser success')
  return user
}
const createUser = async(data) => {
 const user = await prisma.user.create({ ...data })
 if(user == null) console.log('createUser fail')
 console.log('createUser success, userId is ', user.id)
 return user
}
export default {
  fetchUser, createUser
}