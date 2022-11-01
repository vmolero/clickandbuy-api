import {
  STSClient,
  AssumeRoleCommand,
  AssumeRoleCommandOutput
} from '../../../deps.ts'
import config from '../../util/config.ts'
import log from './../LoggerService.ts'

type TmpTokenType = {
  accessKeyId: string | null | undefined
  secretAccessKey: string | null | undefined
  sessionToken: string | null | undefined
  expiration: Date | null
}

type TokenType = {
  accessToken: string | null | undefined
  refreshToken: string | null | undefined
  tokenType: string | null | undefined
  expiresIn: number | null
}

let tmpToken: TmpTokenType = {
  accessKeyId: null,
  secretAccessKey: null,
  sessionToken: null,
  expiration: null
}

let token: TokenType = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresIn: null
}

async function stsAssumeRole() {
  const region = config.aws.region
  const roleArn = config.aws.iam.roleArn
  const roleSessionName = config.aws.iam.roleSessionName
  const accessKeyId = config.aws.iam.accessKeyId
  const secretAccessKey = config.aws.iam.secretAccessKey
  try {
    const stsClient = new STSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
    log.info(
      `Request to AWS [client=sts, command=AssumeRoleCommand, roleArn=${roleArn}, roleSessionName=${roleSessionName}]`
    )
    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: roleSessionName
    })
    const { Credentials }: AssumeRoleCommandOutput = await stsClient.send(
      assumeRoleCommand
    )

    if (Credentials === undefined) {
      throw new Error(`Credentials are undefined`)
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
        ? new Date(Credentials.Expiration)
        : null
    }
  } catch (err) {
    log.error(
      `Failed request [client=sts, command=AssumeRoleCommand]: ${err.message}`
    )
    throw new Error(err.message)
  }
}

async function authO2Token(): Promise<TokenType> {
  try {
    log.info(`Request to AWS [endpoint=${config.aws.oAuthEndpoint}]`)
    const tokenResponse = await fetch(config.aws.oAuthEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: config.aws.spApi.appLwaRefreshToken,
        client_id: config.aws.spApi.appClientId,
        client_secret: config.aws.spApi.appClientSecret
      })
    })
    const response = await tokenResponse.json()
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      tokenType: response.token_type,
      expiresIn: Number(response.expires_in)
    }
  } catch (err) {
    log.error(
      `Failed request [endpoint=${config.aws.oAuthEndpoint}]: ${err.message}`
    )
    throw new Error(err.message)
  }
}

async function getTemporaryAccessCredentials() {
  if (!tmpToken.expiration || tmpToken.expiration < new Date()) {
    tmpToken = await stsAssumeRole()
  }

  return tmpToken
}

async function getAccessToken() {
  if (!token.accessToken) {
    token = await authO2Token()
    setTimeout(() => {
      token.accessToken = null
    }, Number(token.expiresIn) * 1000 - 10000)
  }

  return token
}

async function getAuthTokens() {
  const [tmpToken, token] = await Promise.all([
    getTemporaryAccessCredentials(),
    getAccessToken()
  ])
  return {
    tmpToken,
    token
  }
}

export { getAuthTokens }
