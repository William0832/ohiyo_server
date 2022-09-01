import userDbService from '../services/user.js'
import orderDbService from '../services/order.js'

const _api = (api, opts, done) => {
   api.addHook('preHandler', async (req, res) => {
      //do something on api routes
      if (res.sent) return //stop on error (like user authentication)
    }) 
    // get
    api.get('/orders', async (req, res) => {
      return { 
        success: true,
        data: { orders: [] },
        message: 'success'
      }
    })
    // create
    api.post('/orders', async (req, res) => {
      try {
        const { cart, customer, shopId } = req.body
        if(customer == null || customer.lineId == null || cart ==null ) throw new Error(
          'Missing cart or customer data'
        )
        // user
        const { name: userName, lineId, phone } = customer
        const userData = { 
          name: userName, 
          lineId, 
          phone, 
          shop: { create: { shopId } } 
        }
        const user = 
          await userDbService.fetchUser(lineId) || 
          await userDbService.createUser(userData)
        // order
        const orderData = {
          ...cart, 
          ownerId: user?.id,
        }
        const order = await orderDbService.createOrder(orderData)
        if (order == null) throw new Error('create order fail')
        return { 
          success: true,
          data: { order },
          message: 'create order success'
        }
      } catch(err) {
        console.error(err)
        throw new Error(err?.message || err)
      }
    })
    done()
}
export default _api