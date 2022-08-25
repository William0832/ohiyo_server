import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createOrder = async(payload) => {
  console.log(payload)
  const {
    items, special, bookingDate, totalPrice, ownerId
  } = payload
  console.log(items)
  const data = {
    totalPrice,
    status: 'pendingPay',
    // special: 'test', TODO: table add column
    ownerId,
    orderFoods: {
      create: items.map(e =>({
        foodId: e.itemId,
        special: e.special,
        spicyLevel: e.spicyLevel,
        addItems: e.addItems.map(a =>a.name).join('/'),
        amount: e.amount,
        discount: e?.discount || 0, //TODO: FE
        addItemPrice: e.itemPrice - e.price,
        totalPrice: e.amount * e.itemPrice
      }))
    }

  }
  const order = await prisma.order.create({ data })
  return order
}

const updateOrderState = () => {

}

export default {
  createOrder,
  updateOrderState
}