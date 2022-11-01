import log from './src/services/LoggerService.ts'
import config from './src/util/config.ts'
import api from './src/api.ts'

const port = config.app.port

api.listen(port, () =>
  log.info(`server has started on http://localhost:${port} 🚀`)
)
