import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './routers/_index.js'
import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())
app.use('/api', router)

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})
const EVENT = { MSG: 'MSG' }
io.on('connect', (socket) => {
  const { id } = socket
  console.log(`connect: ${id}`.green)

  socket.on(EVENT.MSG, payload => {
    console.log('socket.on:', EVENT.MSG, payload)
    io.emit(EVENT.MSG, payload)
  })
  socket.on('DISCONNECT', () => {
    console.log(`disconnect: ${id}`.red)
  })
})

const { PORT } = process.env || 3000
server.listen(PORT, () => {
  console.log(`Server ready at: http://localhost:${PORT}`.green)
})
