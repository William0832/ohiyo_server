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

const fetchFoodsByTypeId = async (shopId, foodTypeId) => {
  const foods = await prisma.food.findMany({
    where: { shopId, foodTypeId, deletedAt: null },
    include: {
      foodType: true
    }
  })
  if (foods == null) throw new Error('fetchFoodsByTypeId')
  return foods
}

const fetchFood = async (shopId, foodId) => {
  const food = await prisma.food.findFirst({
    where: { shopId, id: foodId, deletedAt: null },
    include: {
      foodType: true
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
  deleteFood
}
