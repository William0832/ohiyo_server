import express from 'express'
import axios from 'axios'
const lineBotRouter = express.Router()

lineBotRouter.get('', (req, res) =>
  res.end('I\'m listening. Please access with POST.')
)

lineBotRouter.post('', async (req, res) => {
  try {
    const { events } = req.body
    await Promise.all(events.map(e => sendMsg(e)))
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500)
      .json({ success: false, errorMessage: '500' })
  }
})

export default lineBotRouter

async function sendMsg (e) {
  const { replyToken, type, message } = e
  console.log('msg', { type })
  if (type !== 'message' || message.type !== 'text') {
    return Promise.resolve(null)
  }
  const payload = {
    replyToken,
    messages: [{
      type: 'text',
      text: message.text
    }]
  }
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN
  }
  const res = await axios.post(
    'https://api.line.me/v2/bot/message/reply', payload, { headers }
  )
  console.log('Send msg status', `${res.status}`.green)
  return res
}
