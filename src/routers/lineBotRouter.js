import express from 'express'
import line from '@line/bot-sdk'
const lineBotRouter = express.Router()

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const handleEvent = (e) => {
  if (e.type !== 'message' || e.message.type !== 'text') {
    return Promise.resolve(null)
  }
  const echo = { type: 'text', text: e.message.text }
  return client.replyMessage({
    replyToken: e.replyToken,
    messages: [echo]
  })
}
lineBotRouter.get('', (req, res) => res.end('I\'m listening. Please access with POST.'))

lineBotRouter.post('', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

export default lineBotRouter
