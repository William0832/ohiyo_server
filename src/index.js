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
  origin: true,
  // origin: process.env.CLIENT_URL,
  credentials: true
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

// async function commitToDb (promise) {
//   const [error, data] = await app.to(promise)
//   if (error) return app.httpErrors.internalServerError(error.message)
//   return data
// }

const port = process.env.PORT || 3000
app.listen({ port }, (err, address) => {
  if (err) console.error(err)
  console.log('server listening on', address)
})

// app.post(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts
//     ? posts.map((post) => {
//         return { title: post.title, content: post.content || undefined }
//       })
//     : []

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   res.send(result)
// })

// app.post(`/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   res.send(result)
// })

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.send(post)
//   } catch (error) {
//     res.send({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData.published || undefined },
//     })
//     res.send(updatedPost)
//   } catch (error) {
//     res.send({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params

//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.send(post)
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.send(users)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.send(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.send(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString } },
//           { content: { contains: searchString } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy || undefined,
//     },
//   })

//   res.send(posts)
// })
