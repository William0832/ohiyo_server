// import { PrismaClient } from '@prisma/client'

import fastify from 'fastify'
import cors from '@fastify/cors'
import { shop, order, food, user } from './routers/_index.js'
// import sensible from "@fastify/sensible"

import dotenv from 'dotenv'

dotenv.config()
const logger = {
  transport: {
    target: '@fastify/one-line-logger'
  }
}
const app = fastify({ logger })
app.register(cors, {
  origin: true
  // origin: process.env.CLIENT_URL,
  // credentials: true
})
// app.register(sensible)

// const prisma = new PrismaClient()
app.get('/', async (req, res) => {
  console.log('!!!!!!!')
  return { message: 'success' }
})

app.register(shop, { prefix: '/api' })
app.register(order, { prefix: '/api' })
app.register(user, { prefix: '/api' })
app.register(food, { prefix: '/api' })

const port = process.env.PORT || 5000
console.log({ port })
app.listen({ port }, (err, address) => {
  if (err) console.error(err)
  console.log('server listening on', address)
})
