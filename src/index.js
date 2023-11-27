import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import router from './routers/_index.js'
import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'
import { createSocketServer } from './services/socket.js'
import lineBotRouter from './routers/lineBotRouter.js'
dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())
app.use('/api', router)
app.use('/lineWebHook', lineBotRouter)

const server = http.createServer(app)

const io = createSocketServer(server)
app.locals.io = io
const { PORT } = process.env || 3000
server.listen(PORT, () => {
  console.log(`Server ready at: http://localhost:${PORT}`.green)
})
