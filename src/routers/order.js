import userDbService from '../services/user.js'
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
        const { cart, customer } = req.body
        if(customer == null || customer.lineId == null || cart ==null ) throw new Error(
          'Missing cart or customer data'
        )
        console.log(cart, customer )
        const { name: userName, lineId, phone } = customer
        const userData = { name: userName, lineId, phone }
        const user = 
          await userDbService.fetchUser(lineId) || 
          await userDbService.createUser({data: userData})
        return { 
          success: true,
          data: { order: {...cart, ...user, orderId: 12345} },
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