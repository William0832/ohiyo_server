import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const fetchShop = async(id) => {
  const ormSearchData = { 
    where: { id },
    include: {
      activeSchedule: {
        select: { 
          id: true, 
          name: true,
          weekDayOpenTimes: {
            select: {
              id: true,
              weekDay: true,
              openTime: true
            }
          }
        }
      }     
    }
  }
  const shop = await prisma.shop.findUnique(ormSearchData)
  if(shop == null) throw Error('no shop')
  return shop
}


export default {
  fetchShop
}