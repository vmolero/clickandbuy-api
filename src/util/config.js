import { config } from 'https://deno.land/std@0.160.0/dotenv/mod.ts'

const envConfig = await config()
const defaultPort = 3000

class Config {
  static createConfig() {
    return new Config(envConfig)
  }

  constructor(envConfig) {
    this.app = {
      port: Number(envConfig.PORT || defaultPort)
    }
  }
}

export default Config.createConfig()
