import * as log from 'https://deno.land/std@0.160.0/log/mod.ts'

await log.setup({
  //define handlers
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG', {
      formatter: '{datetime} {levelName} {msg}'
    })
    // file: new log.handlers.RotatingFileHandler('INFO', {
    //   filename: './a.log',
    //   maxBytes: 15,
    //   maxBackupCount: 5,
    //   formatter: (rec) =>
    //     JSON.stringify({
    //       region: rec.loggerName,
    //       ts: rec.datetime,
    //       level: rec.levelName,
    //       data: rec.msg
    //     })
    // })
  },

  //assign handlers to loggers
  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console']
    },
    client: {
      level: 'INFO',
      handlers: ['file']
    }
  }
})

export default log
