import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const fetchFoodsByTypes = async (shopId) => {
  const foodTypes = await prisma.foodType.findMany({
    where: { shopId },
    include: {
      foods: true
    }
  })
  if (foodTypes == null) throw new Error('fetchFoodsByTypes')
  return foodTypes
}

const fetchFoodsByTypeId = async (shopId, foodTypeId) => {
 const foods = await prisma.food.findMany({
    where: { shopId,  foodTypeId },
    include: {
      foodType: true
    }
  })
  if (foods == null) throw new Error('fetchFoodsByTypeId')
  return foods
}

const fetchFood = async (shopId, foodId) => {
  const food = await prisma.food.findFirst({
    where: { shopId, id:  foodId },
    include: {
      foodType: true
    }
  })
  if (food == null) throw new Error('fetchFood')
  return food
}

export default {
  fetchFoodsByTypes,
  fetchFoodsByTypeId,
  fetchFood
}