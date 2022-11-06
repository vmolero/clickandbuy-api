import log from './src/services/LoggerService.ts'
import config from './src/util/config.ts'
import api from './src/api.ts'
import { startSocketServer } from './src/socket.ts'

const port = config.app.port

api.listen(port, () =>
  log.info(`API listening on http://localhost:${port} 🚀`)
)

await startSocketServer({
  port: 8886,
  cors: {
    origin: '*'
  },
  onListen: ({ port, hostname }) => {
    log.info(`socket.io server listening on http://${hostname}:${port} 🚀`)
  },
  onConnection: (socket) => {
    log.info(`socket ${socket.id} connected`)

    socket.emit('message', { hi: `Hola ${socket.id}` })

    socket.on('disconnect', (reason) => {
      log.info(`socket ${socket.id} disconnected due to ${reason}`)
    })
  }
})
