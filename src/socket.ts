import { Socket } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'
import { SocketIOServer, HttpServeInit, serveHttp } from '../deps.ts'
import log from './services/LoggerService.ts'

export const startSocketServer = (options: {
  port: number
  cors: { origin: string }
  onListen: ({ port, hostname }: { port: number; hostname: string }) => void
  onConnection: (socket: Socket) => void
}) => {
  try {
    const io = new SocketIOServer({
      cors: {
        origin: '*'
      }
    })
    io.on('connection', options.onConnection)

    return serveHttp(io.handler(), options as HttpServeInit)
  } catch (err) {
    log.error(`Failed to start socket io server: ${err.message}`)
  }
}
