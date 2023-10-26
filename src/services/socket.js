import { Server } from 'socket.io'

export const createSocketServer = (server) => {
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

  return io
}
