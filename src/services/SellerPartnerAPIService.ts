import config from '../util/config.ts'
import log from './LoggerService.ts'
import AWSSignedRequest from './aws/AWSSignedRequest.ts'

class SellerPartnerAPIService {
  private endpoint: string;

  constructor() {
    this.endpoint = config.aws.endpoint
  }

  async getItemByAsin({ marketId = 'A1RKKUPIHCS9HS', asin }: { marketId: string; asin: string}) {
    const request = new AWSSignedRequest({ service: 'execute-api' })
    log.info(
      `Request to SP-API [endpoint=${this.endpoint}/catalog/2022-04-01/items/${asin}, market=${marketId}, asin=${asin}]`
    )
    const response = await request.fetch(
      `${this.endpoint}/catalog/2022-04-01/items/${asin}?marketplaceIds=${marketId}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        }
      }
    )

    if (response.status === 200) {
      return response.json()
    }

    throw new Error(
      `Failed request [status=${response.status}, reason=${response.statusText}]`
    )
  }
  async getMarketplaceParticipations() {
    const request = new AWSSignedRequest({ service: 'execute-api' })
    const response = await request.fetch(
      `${this.endpoint}/sellers/v1/marketplaceParticipations`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        }
      }
    )

    if (response.status === 200) {
      return response.json()
    }

    throw new Error(
      `Failed request [status=${response.status}, reason=${response.statusText}]`
    )
  }
}

export default new SellerPartnerAPIService()
