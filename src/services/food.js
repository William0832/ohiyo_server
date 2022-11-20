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
  const [foodType, total, foods] = await prisma.$transaction([
    prisma.foodType.findFirst({ where: { id: +foodTypeId } }),
    prisma.food.count(whereOption),
    prisma.food.findMany(pageOption)
  ])
  if (foodType == null) throw new Error('no foodType')
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
  return newFood
}
const updateFood = async (payload) => {
  const {
    foodId,
    name, info, price, isSoldOut
  } = payload
  const food = await prisma.food.update({
    where: {
      id: foodId
    },
    data: {
      name,
      info,
      price,
      isSoldOut
    }
  })
  return food
}
const updateColValue = async ({ id, colName, value }) => {
  return prisma.food.update({
    where: { id },
    data: {
      [colName]: value
    }
  })
}
const deleteFood = async (foodId) => {
  const food = prisma.food.update({
    where: {
      id: foodId
    },
    data: {
      deletedAt: new Date()
    }
  })
  return food
}
const updateImg = async ({ foodId, imgId, path }) => {
  if (imgId) {
    console.log({ imgId })
    const img = await prisma.img.update({ where: { id: +imgId }, data: { path } })
    return await prisma.food.findUnique({ where: { id: +foodId } })
  }
  const food = await prisma.food.update({
    where: { id: +foodId },
    data: {
      img: { create: { path } }
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
  updateColValue,
  deleteFood,
  updateImg
}
