import MULTICALL_ABI from './abi.json'
import { ChainId } from '../../utils'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.GÖRLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.XDAI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  [ChainId.MATIC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
