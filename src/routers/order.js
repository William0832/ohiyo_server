const _api = (api, opts, done) => {
   api.addHook('preHandler', async (req, res) => {
      //do something on api routes
      if (res.sent) return //stop on error (like user authentication)
    }) 
    api.get('/orders', async (req, res) => {
      return { 
        success: true,
        data: { orders: [] },
        message: 'success'
      }
    })
    api.post('/orders', async (req, res) => {
      const {cart, customer } = req.body
      console.log(cart, customer )
      return { 
        success: true,
        data: { order: {...cart, ...customer, orderId: 12345} },
        message: 'create order success'
      }
    })
    done()
}
export default _api