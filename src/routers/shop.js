import shopDbService from "../services/shop.js"

const _api = (api, opts, done) => {
   api.addHook('preHandler', async (req, res) => {
      //do something on api routes
      if (res.sent) return //stop on error (like user authentication)
    }) 
    api.get('/shops/:id', async (req, res) => {
      const { id } = req.params
      // const { includeFoods } = req.query
      const shop = await shopDbService.fetchShop(+id)
      return { 
        success: true,
        data: { shop },
        message: 'success'
      }
    })

    done()
}
export default _api