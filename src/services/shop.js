import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const fetchShop = async(id, includeFoods) => {
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
      },
      
    }
  }
  if (includeFoods) {
    ormSearchData.include.foods = {
      include: { 
        foodType: { 
          select: {
            id: true,
            name: true,
            info: true
          }
        }
      },
      where: { foodTypeId: { in: [1, 2] } }
    } 
  }
  const shop = await prisma.shop.findUnique(ormSearchData)
  if(shop == null) throw Error('no shop')
  return shop
}


export default {
  fetchShop
}