import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const foodTypeData = [
  {
    name: '主餐'
  },
  {
    name: '飲料',
    info: '主餐加點飲料 折抵＄10'
  },
  {
    name: '主餐加點'
  },
]
const foodData = [
  { 
    foodTypeId: 1,
    name: '蔬食炒泡麵',
    price: 120,
    info: '',
  },
   { 
    foodTypeId: 1,
    name: '輕鬆肉香腸炒泡麵',
    price: 150,
    info: '',
  },
   { 
    foodTypeId: 2,
    name: '檸檬可樂',
    price: 40,
    info: '',
  },
  { 
    foodTypeId: 2,
    name: '薄荷椰子水',
    price: 60,
    info: '',
  },
  { 
    foodTypeId: 3,
    name: '加麵',
    price: 20,
    info: '',
  },
  { 
    foodTypeId: 3,
    name: '動福蛋',
    price: 20,
    info: '',
  }
]


async function seedHandler ({data, tableName}) {
  console.log(`Start seeding ...`)
  for (const e of data) {
    const item = await prisma[tableName].create({ data: e })
    console.log(`Created ${tableName} with id: ${item.id}`)
  }
  console.log(`Seeding finished.`)
}
async function main() {
  await seedHandler({ data:foodTypeData, tableName: 'foodType' })
  await seedHandler({ data:foodData, tableName: 'food' })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
