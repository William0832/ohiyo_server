import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const fetchOrders = async (timeType) => {
  console.log(new Date())
  const start = new Date(
      `${new Date().toLocaleDateString()} 00:00:00`
  )
  const end = new Date(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toLocaleDateString() + ' 00:00:00'
  )
  console.log({ start, end })
  if (timeType === 'current') {
    const orders = await prisma.order.findMany({
      where: {
        updatedAt: { gte: start }
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
      updatedAt: { lt: start }
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
    status: 'pendingPay',
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
