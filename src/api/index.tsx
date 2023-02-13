import {
  AdditionalServicesApi,
  AdditionalServicesApiImpl,
  AdditionalServicesEndpoint,
} from './AdditionalServicesApi'
import { TokenLogosServiceApi, TokenLogosServiceApiInterface } from './TokenLogosServiceApi'
import {
  GRAPH_API_URL_DEVELOP_GOERLI,
  GRAPH_API_URL_DEVELOP_MAINNET,
  GRAPH_API_URL_DEVELOP_POLYGON,
  GRAPH_API_URL_DEVELOP_XDAI,
  GRAPH_API_URL_PRODUCTION_GOERLI,
  GRAPH_API_URL_PRODUCTION_MAINNET,
  GRAPH_API_URL_PRODUCTION_POLYGON,
  GRAPH_API_URL_PRODUCTION_XDAI,
} from '../constants/config'

function createAdditionalServiceApi(): AdditionalServicesApi {
  const config: AdditionalServicesEndpoint[] = [
    {
      networkId: 100,
      graph_url_production: GRAPH_API_URL_PRODUCTION_XDAI,
      graph_url_develop: GRAPH_API_URL_DEVELOP_XDAI,
    },
    {
      networkId: 1,
      graph_url_production: GRAPH_API_URL_PRODUCTION_MAINNET,
      graph_url_develop: GRAPH_API_URL_DEVELOP_MAINNET,
    },
    {
      networkId: 137,
      graph_url_production: GRAPH_API_URL_PRODUCTION_POLYGON,
      graph_url_develop: GRAPH_API_URL_DEVELOP_POLYGON,
    },
  ]
  if (GRAPH_API_URL_DEVELOP_GOERLI)
    config.push({
      networkId: 5,
      graph_url_production: GRAPH_API_URL_PRODUCTION_GOERLI,
      graph_url_develop: GRAPH_API_URL_DEVELOP_GOERLI,
    })
  const dexPriceEstimatorApi = new AdditionalServicesApiImpl(config)

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

// Build APIs
export const additionalServiceApi: AdditionalServicesApi = createAdditionalServiceApi()
export const tokenLogosServiceApi: TokenLogosServiceApiInterface = new TokenLogosServiceApi()
