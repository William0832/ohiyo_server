const EVENT_MSG = 'MSG'

const onMsg = (socket, { id, type, value }) => {
  console.log(`EVENT-${EVENT_MSG}: 
    ${JSON.stringify({ type, value })}`.blue)
  socket.emit(EVENT_MSG, `${id} msg done`)
}

const onSocket = (socket) => {
  const { id } = socket
  console.log(`CONNECT: ${id}`.green)
  socket.emit(EVENT_MSG, `new user: ${id} join`)

  socket.on(EVENT_MSG, ({ type, value }) => {
    onMsg(socket, { id: socket.id, type, value })
  })
  socket.on('DISCONNECT', () => {
    console.log(`disconnect: ${id}`.red)
    socket.emit(EVENT_MSG, `${id} leave`)
  })
}

export default onSocket
