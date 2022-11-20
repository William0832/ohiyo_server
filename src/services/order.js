import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()
const fetchOrders = async ({ orderCategory, take, skip, orderBy }) => {
  orderBy = orderBy || { updatedAt: 'desc' }
  const now = new Date()
  const todayStart = new Date(`${dayjs(now).format('YYYY-MM-DD')} 00:00:00`)
  let where
  switch (orderCategory) {
    case 'current':
      where = { createdAt: { gte: todayStart }, deletedAt: null }
      break
    case 'history':
      where = { createdAt: { lte: todayStart }, deletedAt: null }
      break
    case 'remove':
      where = { deletedAt: { not: null } }
      break
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

}
const createOrder = async (payload) => {
  const {
    items, special,
    // bookingDate,
    totalPrice, ownerId
  } = payload
  const data = {
    totalPrice,
    special,
    // bookingDate,
    ownerId,
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

export default {
  fetchOrder,
  fetchOrders,
  createOrder,
  updateOrderState,
  deleteOrder
}
