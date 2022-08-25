const _api = (api, opts, done) => {
   api.addHook('preHandler', async (req, res) => {
      //do something on api routes
      if (res.sent) return //stop on error (like user authentication)
    }) 
    api.get('/shops', async (req, res) => {
      return { 
        success: true,
        data: { shops: [] },
        message: 'success'
      }
    })

    done()
}
export default _api