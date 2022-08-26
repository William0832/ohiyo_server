import foodDbService from '../services/food.js'
const _api = (api, opts, done) => {
  api.addHook('preHandler', async (req, res) => {
    //do something on api routes
    if (res.sent) return //stop on error (like user authentication)
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
  api.get('/shops/:shopId/foodTypes/:typeId/foods', async (req, res)=> {
    const { shopId, typeId } = req.params
    const foods = await foodDbService.fetchFoodsByTypeId(+shopId, +typeId)
    return { 
      success: true,
      data: { foods },
      message: 'success'
    }
  }),
  api.get('/shops/:shopId/foods/:foodId', async (req, res) => {
    const { shopId, foodId } = req.params
    const food = await foodDbService.fetchFood(+shopId, +foodId)
    return { 
      success: true,
      data: { food },
      message: 'success'
    }
  })
  done()
}
export default _api