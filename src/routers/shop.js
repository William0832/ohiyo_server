import shopDbService from '../services/shop.js'
import express from 'express'
const router = express.Router()
router.get('/shops/:id', async (req, res) => {
  try {
    const { id } = req.params
    const shop = await shopDbService.fetchShop(+id)
    res.json({
      success: true,
      data: { shop },
      message: 'success'
    })
  } catch (err) {
    console.warn(err)
  }
})

export default router
