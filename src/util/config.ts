import { DotenvConfig } from 'https://deno.land/std@0.160.0/dotenv/mod.ts'
import { config } from '../../deps.ts'

const envConfig = await config()
const defaultPort = 3000

class Config {
  public app: { port: number }
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

  static createConfig() {
    return new Config(envConfig)
  }

  constructor(envConfig: DotenvConfig) {
    this.app = {
      port: Number(envConfig.PORT || defaultPort)
    }
    this.aws = {
      spApi: {
        appClientId: envConfig.AWS_SPAPI_APP_CLIENT_ID,
        appClientSecret: envConfig.AWS_SPAPI_APP_CLIENT_SECRET,
        appLwaRefreshToken: envConfig.AWS_SPAPI_APP_LWA_REFRESH_TOKEN
      },
      iam: {
        accessKeyId: envConfig.AWS_IAM_ACCESS_KEY_ID,
        secretAccessKey: envConfig.AWS_IAM_SECRET_ACCESS_KEY,
        roleArn: envConfig.AWS_IAM_ARN_ROLE,
        roleSessionName: envConfig.AWS_IAM_ROLE_SESSION_NAME
      },
      region: envConfig.AWS_REGION,
      endpoint: envConfig.AWS_ENDPOINT,
      oAuthEndpoint: envConfig.AWS_OAUTH_ENDPOINT
    }
  }
}

export default Config.createConfig()
