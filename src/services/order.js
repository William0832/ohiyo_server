import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()
const fetchOrders = async ({ orderCategory, take, skip, orderBy, food, userName, payStatus, prepareStatus }) => {
  orderBy = orderBy || { updatedAt: 'desc' }
  const now = new Date()
  const todayStart = new Date(`${dayjs(now).format('YYYY-MM-DD')} 00:00`)
  let where
  switch (orderCategory) {
    case 'today':
      where = { createdAt: { gte: todayStart }, deletedAt: null }
      break
    case 'history':
      where = { createdAt: { lte: todayStart }, deletedAt: null }
      break
    case 'remove':
      where = { deletedAt: { not: null } }
      break
  }
  if (userName !== '') {
    where.owner = {
      name: { contains: userName, mode: 'insensitive' }
    }
  }
  if (payStatus !== '') {
    where.payStatus = payStatus
  }
  if (prepareStatus !== '') {
    where.prepareStatus = prepareStatus
  }
  if (food !== '') {
    const newWhere = {
      AND: [
        {
          OR: food.split(',').map(f => ({
            orderFoods: {
              some: { food: { name: { contains: f.slice(), mode: 'insensitive' } } }
            }
          }))
        },
        {
          ...where
        }
      ]
    }
    where = newWhere
  }

  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      take,
      skip,
      orderBy,
      include: {
        owner: true,
        orderFoods: {
          include: {
            food: true
          }
        }
      }
    })
  ])
  return [total, orders]
}
const fetchOrder = async (id) => {
  const order = prisma.order.findFirst({
    where: { id },
    include: {
      orderFoods: {
        select: {
          special: true,
          addItems: true,
          amount: true,
          discount: true,
          spicyLevel: true,
          totalPrice: true,
          addItemPrice: true,
          food: true
        }
      },
      owner: true,
      shop: true
    }
  })
  return order
}
const createOrder = async (payload) => {
  const {
    items, special, shopId,
    // bookingDate,
    totalPrice, ownerId
  } = payload
  const data = {
    totalPrice,
    special,
    // bookingDate,
    ownerId,
    shopId,
    orderFoods: {
      create: items.map(e => {
        return {
          foodId: e.itemId,
          special: e.special,
          spicyLevel: e.spicyLevel,
          addItems: e.addItems.map(a => a.name).join('/'),
          amount: e.amount,
          discount: e?.discount || 0, // TODO: FE
          addItemPrice: e.itemPrice - e.price,
          totalPrice: e.amount * e.itemPrice
        }
      })
    }
  }
  const order = await prisma.order.create({
    data,
    include: {
      owner: true,
      orderFoods: {
        include: { food: true }
      }
    }
  })
  return order
}

const updateOrderState = async ({ id, key, status }) => {
  return await prisma.order.update({
    where: { id },
    data: {
      [key]: status
    }
  })
}
const deleteOrder = async (id) => {
  const time = new Date()
  return await prisma.order.update({
    where: { id },
    data: {
      deletedAt: time
    }
  })
}
const fetchOrderHistory = async ({ ownerId, take, cursor }) => {
  const payload = { take: +take, where: { ownerId: +ownerId }, orderBy: { updatedAt: 'desc' } }
  if (cursor) {
    payload.skip = 1
    payload.cursor = { id: cursor }
  }
  return await prisma.order.findMany({ ...payload, include: { orderFoods: { include: { food: true } } } })
}
export default {
  fetchOrder,
  fetchOrders,
  createOrder,
  updateOrderState,
  deleteOrder,
  fetchOrderHistory
}
