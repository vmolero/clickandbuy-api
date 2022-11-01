import { opine, OpineRequest, OpineResponse } from '../deps.ts'
import log from './services/LoggerService.ts'
import spApi from './services/SellerPartnerAPIService.ts'

const api = opine()

api.get(
  '/markets/:countryCode/asin/:asin',
  async function (req: OpineRequest, res: OpineResponse) {
    log.info(`GET /markets/:countryCode/asin/:asin`)
    log.debug(req.params.countryCode)
    const markets = await spApi.getMarketplaceParticipations();
    const esMarketId = markets.payload.find((market:any) => market.countryCode === 'ES')
    const item = await spApi.getItemByAsin({ marketId: esMarketId, asin: 'B0B3KXG3LY' })

    res.send(item)
  }
)

export default api
