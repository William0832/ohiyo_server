import foodDbService from '../services/food.js'
import { uploadImgs } from '../services/img.js'

const _api = (api, opts, done) => {
  api.addHook('preHandler', async (req, res) => {
    // do something on api routes
    if (res.sent) return null// stop on error (like user authentication)
  })
  api.get('/shops/:shopId/fetchFoodsByTypes', async (req, res) => {
    try {
      const { shopId } = req.params
      const foodTypes = await foodDbService.fetchFoodsByTypes(+shopId)
      return {
        success: true,
        data: { foodTypes },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.get('/shops/:shopId/foodTypes/:typeId/foods', async (req, res) => {
    const { shopId, typeId } = req.params
    const { take, skip } = req.query
    const payload = {
      ...req.query,
      take: take ? +take : undefined,
      skip: skip ? +skip : undefined
    }
    try {
      const data = await foodDbService.fetchFoodsByTypeId(+shopId, +typeId, payload)
      return {
        success: true,
        data,
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.get('/shops/:shopId/foods/:foodId', async (req, res) => {
    try {
      const { shopId, foodId } = req.params
      const food = await foodDbService.fetchFood(+shopId, +foodId)
      return {
        success: true,
        data: { food },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.post('/shops/:shopId/foods', async (req, res) => {
    try {
      const { body } = req
      if (body.name === '' || body.name == null) throw new Error('need name')
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
      res.internalServerError(err.message)
    }
  })
  api.put('/shops/:shopId/foods/:foodId', async (req, res) => {
    try {
      const { body } = req
      if (body.name === '' || body.name == null) throw new Error('need name')
      const payload = {
        ...body,
        foodId: +req.params.foodId
      }
      const food = await foodDbService.updateFood(payload)
      if (!food) throw new Error('update fail')
      return {
        success: true,
        data: { food },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.patch('/shops/:shopId/foods/:foodId', async (req, res) => {
    try {
      const { colName, value } = req.body
      const payload = { colName, value, id: +req.params.foodId }
      const food = await foodDbService.updateColValue(payload)
      return {
        success: true,
        data: { food },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.delete('/shops/:shopId/foods/:foodId', async (req, res) => {
    try {
      const { foodId } = req.params
      await foodDbService.deleteFood(+foodId)
      return {
        success: true,
        data: null,
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  api.post('/shops/:shopId/foods/:foodId/imgs', async (req, res) => {
    try {
      const { foodId } = req.params
      const { imgId, img } = req.body
      // const { img } = req.raw.files
      const { id: imgurId, link: path } = await uploadImgs(img)
      await foodDbService.updateImg({ foodId, imgId, path })
      return {
        success: true,
        data: { img: path },
        message: 'success'
      }
    } catch (err) {
      res.internalServerError(err.message)
    }
  })
  done()
}
export default _api
