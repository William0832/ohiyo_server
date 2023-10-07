import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './routers/_index.js'
import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'
import onSocket from './services/socket.js'
dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(fileUpload)
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})

io.on('connect', onSocket)

app.use('/api', router)

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Io Server ready at: http://localhost:${3000}`.green)
})
