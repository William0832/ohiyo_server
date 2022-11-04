import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()
const fetchOrders = async (timeType) => {
  const now = new Date()
  const todayStart = new Date(`${dayjs(now).format('YYYY-MM-DD')} 00:00:00`)
  if (timeType === 'current') {
    const orders = await prisma.order.findMany({
      where: {
        updatedAt: { gte: todayStart }
      },
      include: {
        owner: true,
        orderFoods: true
      }
    })
    return orders
  }
  const orders = await prisma.order.findMany({
    where: {
      updatedAt: { lte: todayStart }
    },
    include: {
      owner: true,
      orderFoods: true
    }
  })
  return orders
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
  const order = await prisma.order.create({ data })
  return order
}

const updateOrderState = () => {

}

export default {
  fetchOrders,
  createOrder,
  updateOrderState
}
