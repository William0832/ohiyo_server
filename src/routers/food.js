const _api = (api, opts, done) => {
   api.addHook('preHandler', async (req, res) => {
      //do something on api routes
      if (res.sent) return //stop on error (like user authentication)
    }) 
    api.get('/foods', async (req, res) => {
      return { 
        success: true,
        data: { foods: [] },
        message: 'success'
      }
    })
    done()
}
export default _api