import foodDbService from '../services/food.js'
const _api = (api, opts, done) => {
  api.addHook('preHandler', async (req, res) => {
    // do something on api routes
    if (res.sent) return null// stop on error (like user authentication)
  })
  api.get('/shops/:shopId/fetchFoodsByTypes', async (req, res) => {
    const { shopId } = req.params
    const foodTypes = await foodDbService.fetchFoodsByTypes(+shopId)
    return {
      success: true,
      data: { foodTypes },
      message: 'success'
    }
  })

  api.get('/shops/:shopId/foodTypes/:typeId/foods',
    async (req, res) => {
      const { shopId, typeId } = req.params
      const { take, skip } = req.query
      const payload = {
        ...req.query,
        take: +take,
        skip: +skip
      }
      const data = await foodDbService.fetchFoodsByTypeId(+shopId, +typeId, payload)
      return {
        success: true,
        data,
        message: 'success'
      }
    }
  )
  api.get('/shops/:shopId/foods/:foodId', async (req, res) => {
    const { shopId, foodId } = req.params
    const food = await foodDbService.fetchFood(+shopId, +foodId)
    return {
      success: true,
      data: { food },
      message: 'success'
    }
  })
  api.post('/shops/:shopId/foods', async (req, res) => {
    try {
      const { body } = req
      const { shopId } = req.params
      const payload = {
        shopId,
        ...body
      }
      const food = await foodDbService.createFood(payload)
      if (!food) throw new Error('create fail')
      return {
        success: true,
        data: { food },
        message: 'success'
      }
    } catch (err) {
      return {
        success: false,
        data: null,
        message: err
      }
    }
  })
  api.delete('/shops/:shopId/foods/:foodId',
    async (req, res) => {
      try {
        const { shopId, foodId } = req.params
        await foodDbService.deleteFood(shopId, foodId)
        return {
          success: true,
          data: null,
          message: 'success'
        }
      } catch (err) {
        return {
          success: false,
          data: null,
          message: err
        }
      }
    })
  done()
}
export default _api
