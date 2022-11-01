import { AWSSignerV4, Credentials } from '../../../deps.ts'
import { getAuthTokens } from './AWSAuth.ts'
import config from '../../util/config.ts'

class AWSSignedRequest {
  private service: string
  private region: string

  constructor({
    service
  }: {
    service: string
  }) {
    this.service = service
    this.region = config.aws.region
  }

  async fetch(endpoint: string, options: RequestInit) {
    const { tmpToken, token } = await getAuthTokens()

    if (!token.accessToken) {
      throw new Error(`Failed to get a valid token`)
    }
    const signer = new AWSSignerV4(this.region, {
      awsAccessKeyId: tmpToken.accessKeyId,
      awsSecretKey: tmpToken.secretAccessKey,
      sessionToken: tmpToken.sessionToken
    } as Credentials)
    options.headers = {
      ...options.headers,
      ['x-amz-access-token']: token.accessToken
    }
    const request = new Request(endpoint, options)
    const signedRequest = await signer.sign(this.service, request)

    return fetch(signedRequest)
  }
}

export default AWSSignedRequest
