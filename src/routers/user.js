
import express from 'express'
const router = express.Router()

router.get('/users', async (req, res) => {
  return res.json({
    success: true,
    data: { users: [] },
    message: 'success'
  })
})

export default router
