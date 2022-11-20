import userDbService from '../services/user.js'
import orderDbService from '../services/order.js'

const _api = (api, opts, done) => {
  api.addHook('preHandler', async (req, res) => {
    // do something on api routes
    // return // stop on error (like user authentication)
  })
  // get
  api.get('/orders', async (req, res) => {
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
      return {
        success: true,
        data: { total, orders },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  // create
  api.post('/orders', async (req, res) => {
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
        ownerId: user?.id
      }
      const order = await orderDbService.createOrder(orderData)
      if (order == null) throw new Error('create order fail'.red)
      return {
        success: true,
        data: { order },
        message: 'create order success'
      }
    } catch (err) {
      console.error(err.red)
      res.internalServerError(err.message)
    }
  })
  api.patch('/orders/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params
      const { key, status } = req.body
      const payload = {
        id: +orderId,
        key,
        status
      }
      const order = await orderDbService.updateOrderState(payload)
      return {
        success: true,
        data: { order },
        message: 'update order success'
      }
    } catch (err) {
      console.error(err.red)
      res.internalServerError(err.message)
    }
  })
  api.delete('/orders/:orderId', async (req, res) => {
    try {
      const order = await orderDbService.deleteOrder(+req.params.orderId)
      return {
        success: true,
        data: { order },
        message: 'update order success'
      }
    } catch (err) {
      console.error(err.red)
      res.internalServerError(err.message)
    }
  })

  done()
}
export default _api
