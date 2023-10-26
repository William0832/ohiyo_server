import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const foodTypeData = [
  {
    name: '主餐'
  },
  {
    name: '飲料',
    info: ''
  },
  {
    name: '主餐加點'
  }
]
const foodData = [
  {
    foodTypeId: 1,
    name: '有機蔬菜涼拌泡麵',
    price: 100,
    info: '冰涼新上市！'
  },
  {
    foodTypeId: 1,
    name: '有機蔬菜炒泡麵',
    price: 120,
    info: 'feat. 動福蛋'
  },
  {
    foodTypeId: 1,
    name: '輕鬆肉香腸炒泡麵',
    price: 150,
    info: '因為香腸缺貨停售',
    isSoldOut: true
  },
  {
    foodTypeId: 2,
    name: '檸檬可樂',
    price: 40,
    info: ''
  },
  {
    foodTypeId: 2,
    name: '100% 椰子水',
    price: 60,
    info: ''
  },
  {
    foodTypeId: 2,
    name: '浪人啤酒',
    price: 60,
    info: ''
  },
  {
    foodTypeId: 2,
    name: '現打果汁',
    price: 80,
    info: '當季新鮮水果搭配動福鮮奶'
  },
  {
    foodTypeId: 3,
    name: '加麵',
    price: 20,
    info: ''
  },
  {
    foodTypeId: 3,
    name: '動福蛋',
    price: 20,
    info: ''
  },
  {
    foodTypeId: 3,
    name: '韓式泡菜',
    price: 20,
    info: ''
  },
  {
    foodTypeId: 3,
    name: '輕鬆肉香腸',
    price: 30,
    info: '因為香腸缺貨停售',
    isSoldOut: true
  }
]
const shopData = {
  name: 'OHIYO 樂屋',
  address: '261宜蘭縣頭城鎮濱海路二段332巷',
  info: '海邊的好吃炒泡麵',
  phone: '0988870526',
  foodTypes: {
    create: foodTypeData
  },
  schedules: {
    create: {
      name: 'schedule1',
      activeShopId: 1,
      weekDayOpenTimes: {
        create: [
          { weekDay: 6, openTime: '11:00-14:00' },
          { weekDay: 0, openTime: '11:00-14:00' }
        ]
      }
    }
  },
  admins: {
    create: {
      account: 'William',
      psw: '5566'
    }
  },
  foods: {
    create: foodData
  }
}

async function seedHandler ({ data, tableName }) {
  console.log('Start seeding ...')
  data = Array.isArray(data) ? data : [data]
  for (const e of data) {
    const item = await prisma[tableName].create({ data: e })
    console.log(`Created ${tableName} with id: ${item.id}`)
  }
  console.log('Seeding finished.')
}
async function main () {
  // await seedHandler({ data:foodTypeData, tableName: 'foodType' })
  await seedHandler({ data: shopData, tableName: 'shop' })
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
