import fastify from 'fastify'
import fileUpload from 'fastify-file-upload'
import fastifyIO from 'fastify-socket.io'
import cors from '@fastify/cors'
import { shop, order, food, user } from './routers/_index.js'
import sensible from '@fastify/sensible'
import dotenv from 'dotenv'
import colors from 'colors'

colors.enable()
dotenv.config()

const logger = {
  transport: {
    target: '@fastify/one-line-logger'
  }
}
const app = fastify({ logger })
app.register(fileUpload)

app.register(cors, {
  origin: true
  // origin: process.env.CLIENT_URL,
  // credentials: true
})
app.register(fastifyIO, { cors: { origin: '*' } })
app.register(sensible)
app.get('/', async (req, res) => {
  return { message: 'ohiyo apis' }
})

app.register(shop, { prefix: '/api' })
app.register(order, { prefix: '/api' })
app.register(user, { prefix: '/api' })
app.register(food, { prefix: '/api' })

const port = process.env.PORT || 5000

//  socketIO
app.ready(err => {
  if (err) throw err
  // socket IO
  app.io.on('connect', (socket) => {
    const { id } = socket
    console.log(`CONNECT: ${id}`.green)
    socket.emit('msg', `Hi ! ${id}`)
    socket.on('msg', (payload) => {
      console.log(`EVENT-msg: ${JSON.stringify(payload)}`.blue)
    })
    app.io.emit('msg', 'someone in')
    socket.on('disconnect', () => {
      console.log(`disconnect: ${id}`.red)
      app.io.emit('msg', 'someone leave')
    })
  })
})

app.listen({ port }, (err, address) => {
  if (err) console.error(err)
  console.log('server listening on', address)
})
