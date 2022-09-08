const _api = (api, opts, done) => {
  api.addHook('preHandler', async (req, res) => {
    // do something on api routes
    if (res.sent) return null// stop on error (like user authentication)
  })
  api.get('/users', async (req, res) => {
    return {
      success: true,
      data: { users: [] },
      message: 'success'
    }
  })

  done()
}
export default _api
