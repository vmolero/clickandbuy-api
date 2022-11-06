import { config, DotenvConfig } from '../../deps.ts'

const envConfig = await config()
const defaultPort = 3000

class Config {
  public app: { port: number }
  public keyValueService: { defaultTtl: number }
  public redis: {
    host: string
    username: string
    password: string
    port: number
  }
  public aws: {
    spApi: {
      appClientId: string
      appClientSecret: string
      appLwaRefreshToken: string
    }
    iam: {
      accessKeyId: string
      secretAccessKey: string
      roleArn: string
      roleSessionName: string
    }
    region: string
    endpoint: string
    oAuthEndpoint: string
  }
  public cryptoService: {
    key: string
    iv: string
    mode: string
  }

  static createConfig() {
    return new Config(envConfig)
  }

  constructor(envConfig: DotenvConfig) {
    this.app = {
      port: Number(envConfig.PORT || defaultPort)
    }
    this.aws = {
      spApi: {
        appClientId: envConfig.AVVS_SPAPI_APP_CLIENT_ID,
        appClientSecret: envConfig.AVVS_SPAPI_APP_CLIENT_SECRET,
        appLwaRefreshToken: envConfig.AVVS_SPAPI_APP_LWA_REFRESH_TOKEN
      },
      iam: {
        accessKeyId: envConfig.AVVS_IAM_ACCESS_KEY_ID,
        secretAccessKey: envConfig.AVVS_IAM_SECRET_ACCESS_KEY,
        roleArn: envConfig.AVVS_IAM_ARN_ROLE,
        roleSessionName: envConfig.AVVS_IAM_ROLE_SESSION_NAME
      },
      region: envConfig.AVVS_REGION,
      endpoint: envConfig.AVVS_ENDPOINT,
      oAuthEndpoint: envConfig.AVVS_OAUTH_ENDPOINT
    }
    this.redis = {
      host: envConfig.REDIS_HOST,
      username: envConfig.REDIS_USERNAME,
      password: envConfig.REDIS_PASSWORD,
      port: Number(envConfig.REDIS_PORT)
    }
    this.keyValueService = {
      // In milliseconds
      defaultTtl: (Number(envConfig.KEY_VALUE_DEFAULT_TTL) || 600) * 1000
    }
    this.cryptoService = {
      key: envConfig.CRYPTO_SERVICE_KEY,
      iv: envConfig.CRYPTO_SERVICE_IV,
      mode: envConfig.CRYPTO_SERVICE_MODE
    }
  }
}

export default Config.createConfig()
