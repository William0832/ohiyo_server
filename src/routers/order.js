import userDbService from '../services/user.js'
import orderDbService from '../services/order.js'
import express from 'express'
const router = express.Router()

router.get('/orders', async (req, res) => {
  try {
    const { take, skip, orderBy, orderType } = req.query
    const payload = {
      ...req.query,
      take: take ? +take : undefined,
      skip: skip ? +skip : undefined,
      orderBy: {
        [orderBy]: orderType
      }
    }
    const [total, orders] = await orderDbService.fetchOrders(payload)
    return res.json({
      success: true,
      data: { total, orders },
      message: 'success'
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderDbService.fetchOrder(orderId)
    return res.json({
      success: true,
      data: { order },
      message: 'get order success'
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})
// create
router.post('/orders', async (req, res) => {
  try {
    const { cart, customer, shopId } = req.body
    if (customer == null || customer.lineId == null || cart == null) {
      throw new Error('Missing cart or customer data')
    }
    // user
    const { name: userName, lineId, phone } = customer
    const userData = {
      name: userName,
      lineId,
      phone,
      shopId
    }
    const user =
      await userDbService.fetchUser(lineId) ||
      await userDbService.createUser(userData)
    // order
    const orderData = {
      ...cart,
      ownerId: user?.id,
      shopId
    }
    const order = await orderDbService.createOrder(orderData)
    if (order == null) throw new Error('create order fail'.red)
    return res.json({
      success: true,
      data: { order },
      message: 'create order success'
    })
  } catch (err) {
    console.error(err.toString().red)
    res.status(500).send(err.message)
  }
})
router.patch('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const { key, status, change, receiveMoney } = req.body
    const payload = {
      id: orderId,
      key,
      status
    }
    if (change != null) {
      payload.change = change
    }
    if (receiveMoney != null) {
      payload.receiveMoney = receiveMoney
    }
    const order = await orderDbService.updateOrderState(payload)
    return res.json({
      success: true,
      data: { order },
      message: 'update order success'
    })
  } catch (err) {
    console.error(err.toString().red)
    res.status(500).send(err.message)
  }
})
router.delete('/orders/:orderId', async (req, res) => {
  try {
    const order = await orderDbService.deleteOrder(req.params.orderId)
    const { io } = req.app.locals
    io.emit('MSG', { isRead: false, value: '訂單被刪除', id: order.id, time: new Date() })
    return res.json({
      success: true,
      data: { order },
      message: 'update order success'
    })
  } catch (err) {
    console.error(err.toString().red)
    res.status(500).send(err.message)
  }
})
router.post('/orders/history', async (req, res) => {
  try {
    const { userId, take, cursorId } = req.body
    const orders = await orderDbService.fetchOrderHistory({
      ownerId: userId, take, cursor: cursorId
    })
    return res.json({
      success: true,
      data: { orders },
      message: 'fetch order histories success'
    })
  } catch (err) {
    console.error(err.toString().red)
    res.status(500).send(err.message)
  }
})

export default router
