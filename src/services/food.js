import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const fetchFoodsByTypes = async (shopId) => {
  const foodTypes = await prisma.foodType.findMany({
    where: { shopId, deletedAt: null },
    include: {
      foods: true
    }
  })
  if (foodTypes == null) throw new Error('fetchFoodsByTypes')
  return foodTypes
}

const fetchFoodsByTypeId = async (shopId, foodTypeId, query) => {
  const { take, skip, orderBy, orderType } = query
  const whereOption = { where: { shopId, foodTypeId, deletedAt: null } }
  const pageOption = {
    ...whereOption,
    include: {
      foodType: true
    },
    orderBy: {
      [orderBy]: orderType
    },
    take,
    skip
  }
  const [total, foods] = await prisma.$transaction([
    prisma.food.count(whereOption),
    prisma.food.findMany(pageOption)
  ])
  if (foods == null) throw new Error('fetchFoodsByTypeId')
  return { total, foods }
}

const fetchFood = async (shopId, foodId) => {
  const food = await prisma.food.findFirst({
    where: { shopId, id: foodId, deletedAt: null },
    include: {
      foodType: true,
      img: true
    }
  })
  if (food == null) throw new Error('fetchFood')
  return food
}
const createFood = async (payload) => {
  const {
    shopId, foodTypeId,
    name, info, price, isSoldOut, imgId
  } = payload
  const food = await prisma.food.findFirst({
    where: { name }
  })
  console.log(payload)
  console.log(food)
  if (food) throw new Error(`Food name: "${name}" is repeated.`)
  const newFood = await prisma.food.create({
    data: {
      shopId,
      foodTypeId: +foodTypeId,
      name,
      info,
      price,
      isSoldOut,
      imgId
    }
  })
  console.log(newFood)
  return newFood
}
const updateFood = async (payload) => {
}
const deleteFood = async (shopId, foodId) => {
  const food = prisma.food.update({
    where: {
      shopId,
      foodId
    },
    data: {
      deletedAt: new Date()
    }
  })
  return food
}

export default {
  fetchFoodsByTypes,
  fetchFoodsByTypeId,
  fetchFood,
  createFood,
  updateFood,
  deleteFood
}
