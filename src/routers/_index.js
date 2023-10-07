import userRouter from './user.js'
import shopRouter from './shop.js'
import orderRouter from './order.js'
import foodRouter from './food.js'

import express from 'express'
const router = express.Router()
router.use(shopRouter)
router.use(foodRouter)
router.use(userRouter)
router.use(orderRouter)

export default router
