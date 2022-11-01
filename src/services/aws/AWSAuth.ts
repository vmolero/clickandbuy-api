import {
  STSClient,
  AssumeRoleCommand,
  AssumeRoleCommandOutput
} from '../../../deps.ts'
import config from '../../util/config.ts'
import CryptoService from '../CrypoService.ts'
import KeyValueStorable from '../storage/KeyValueStorable.ts'
import RedisKeyValueService from '../storage/RedisKeyValueService.ts'
import log from './../LoggerService.ts'

let keyValueService: KeyValueStorable | null = null
const cryptoService = CryptoService.createCryptoService()

function calculateExpiresInMilliseconds(expiryDate: Date): number {
  const nowInMilliseconds = Date.now()
  const expiresInMilliseconds = expiryDate.getTime()

  return (expiresInMilliseconds - nowInMilliseconds)
}

type TokenType = {
  accessToken: string | null | undefined
  refreshToken: string | null | undefined
  tokenType: string | null | undefined
  expiresIn: number | null
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
  if (!keyValueService) {
    keyValueService = await RedisKeyValueService.createKeyValueService()
  }
  const hasToken = await keyValueService.has('awsTmpAccessToken')
  if (hasToken) {
    const encryptedToken = await keyValueService.get('awsTmpAccessToken')
    const tmpAccessToken = await cryptoService.decrypt(encryptedToken)
    return JSON.parse(tmpAccessToken)
  }
  const tmpAccessToken = await stsAssumeRole()
  const ttl = tmpAccessToken.expiration
    ? calculateExpiresInMilliseconds(tmpAccessToken.expiration)
    : undefined
  const encryptedToken = await cryptoService.encrypt(
    JSON.stringify(tmpAccessToken)
  )
  await keyValueService.put('awsTmpAccessToken', encryptedToken, ttl)

  return tmpAccessToken
}

async function getAccessToken() {
  if (!keyValueService) {
    keyValueService = await RedisKeyValueService.createKeyValueService()
  }
  const hasToken = await keyValueService.has('awsAccessToken')
  if (hasToken) {
    const encryptedToken = await keyValueService.get('awsAccessToken')
    const accessToken = await cryptoService.decrypt(encryptedToken)
    return JSON.parse(accessToken)
  }
  const oAuthToken = await authO2Token()
  const ttl = oAuthToken.expiresIn
    ? (Number(oAuthToken.expiresIn) - 10) * 1000
    : undefined
  const encryptedToken = await cryptoService.encrypt(JSON.stringify(oAuthToken))
  await keyValueService.put('awsAccessToken', encryptedToken, ttl)

  return oAuthToken
}

async function getAuthTokens() {
  if (!keyValueService) {
    keyValueService = await RedisKeyValueService.createKeyValueService()
  }
  const [aTmpToken, oAuthToken] = await Promise.all([
    getTemporaryAccessCredentials(),
    getAccessToken()
  ])
  return {
    tmpToken: aTmpToken,
    token: oAuthToken
  }
}

export { getAuthTokens }
