import { Signer } from 'ethers'

import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Provider, Web3Provider } from '@ethersproject/providers'
import { parseBytes32String } from '@ethersproject/strings'
import { JSBI, Percent, Token, TokenAmount, WETH } from '@josojo/honeyswap-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { SiweMessage } from 'siwe'

import { ChainId, NETWORK_CONFIGS } from './networkConfig'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import ERC20_BYTES32_ABI from '../constants/abis/erc20_bytes32.json'
import { getLogger } from '../utils/logger'

export { ChainId }

const logger = getLogger('utils/index')

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export const EASY_AUCTION_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101',
  [ChainId.GÖRLI]: '0x1fBAb40C338E2e7243DA945820Ba680C92EF8281',
  [ChainId.XDAI]: '0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101',
  [ChainId.MATIC]: '0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101',
  [ChainId.MUMBAI]: '0x4100aF1E6e8bBc174fc5da4D409e1e3C03F1f85E',
}

export const DEPOSIT_AND_PLACE_ORDER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x10D15DEA67f7C95e2F9Fe4eCC245a8862b9B5B96',
  [ChainId.GÖRLI]: '0xc6e51F2cb369F03672197D0C31Dd5F0d9566217B',
  [ChainId.XDAI]: '0x845AbED0734e39614FEC4245F3F3C88E2da98157',
  [ChainId.MATIC]: '0x93D2BbA07b44e8F2b02F7DA164eE4f7442a3B618',
  [ChainId.MUMBAI]: '0x7f49Ee20f2E83Ca53B08944938E9B6Fad8e3E3B6',
}

const getExplorerPrefix = (chainId: ChainId) => {
  return (
    NETWORK_CONFIGS[chainId].blockExplorers?.default.url ||
    `https://${NETWORK_CONFIGS[chainId].blockExplorers?.default.url || ''}etherscan.io`
  )
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'address',
): string {
  const prefix = getExplorerPrefix(chainId)

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: TokenAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, provider: Provider): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, provider as Provider)
}

// account is optional
export function getEasyAuctionContract(chainId: ChainId, library: Provider) {
  return getContract(EASY_AUCTION_NETWORKS[chainId], easyAuctionABI, library)
}

export function getEasyAuctionAddress(chainId: ChainId) {
  return EASY_AUCTION_NETWORKS[chainId]
}

// account is optional
export function getExchangeContract(pairAddress: string, library: Provider) {
  return getContract(pairAddress, IUniswapV2PairABI, library)
}

// get token info and fall back to unknown if not available, except for the
// decimals which falls back to null
export async function getTokenInfoWithFallback(
  tokenAddress: string,
  library: Web3Provider,
): Promise<{ name: string; symbol: string; decimals: null | number }> {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  const token = getContract(tokenAddress, ERC20_ABI, library)

  const namePromise: Promise<string> = token.name().catch(() =>
    getContract(tokenAddress, ERC20_BYTES32_ABI, library)
      .name()
      .then(parseBytes32String)
      .catch((e: Error) => {
        logger.debug('Failed to get name for token address', e, tokenAddress)
        return 'Unknown'
      }),
  )

  const symbolPromise: Promise<string> = token.symbol().catch(() => {
    const contractBytes32 = getContract(tokenAddress, ERC20_BYTES32_ABI, library)
    return contractBytes32
      .symbol()
      .then(parseBytes32String)
      .catch((e: Error) => {
        logger.debug('Failed to get symbol for token address', e, tokenAddress)
        return 'UNKNOWN'
      })
  })
  const decimalsPromise: Promise<Maybe<number>> = token.decimals().catch((e: Error) => {
    logger.debug('Failed to get decimals for token address', e, tokenAddress)
    return null
  })

  const [name, symbol, decimals]: [string, string, Maybe<number>] = (await Promise.all([
    namePromise,
    symbolPromise,
    decimalsPromise,
  ])) as [string, string, Maybe<number>]
  return { name, symbol, decimals }
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// Always return a non-undefined token display
export function getTokenDisplay(token: Token, chainId: ChainId): string {
  if (isTokenXDAI(token.address, chainId)) return `XDAI`
  if (isTokenWETH(token.address, chainId)) return `ETH`
  if (isTokenWMATIC(token.address, chainId)) return `MATIC`
  return (
    token?.symbol?.slice(0, 7) || token?.name?.slice(0, 7) || token?.address.slice(0, 7) || '🤔'
  )
}

// Always return a non-undefined token display
export function getFullTokenDisplay(token: Token, chainId: ChainId): string {
  if (isTokenXDAI(token.address, chainId)) return `XDAI`
  if (isTokenWETH(token.address, chainId)) return `ETH`
  if (isTokenWMATIC(token.address, chainId)) return `MATIC`
  return token?.symbol || token?.name || token?.address || '🤔'
}

export function isTokenXDAI(tokenAddress?: string, chainId?: ChainId): boolean {
  return !!tokenAddress && !!chainId && tokenAddress == WETH[chainId]?.address && chainId === 100
}

export function isTokenWETH(tokenAddress?: string, chainId?: ChainId): boolean {
  return (
    !!tokenAddress &&
    !!chainId &&
    tokenAddress == WETH[chainId]?.address &&
    (chainId === 1 || chainId === 5)
  )
}

export function isTokenWMATIC(tokenAddress?: string, chainId?: ChainId): boolean {
  return !!tokenAddress && !!chainId && tokenAddress == WETH[chainId]?.address && chainId === 137
}

export function isTimeout(timeId: NodeJS.Timeout | undefined): timeId is NodeJS.Timeout {
  return typeof timeId !== 'undefined'
}

export interface AuthSig {
  sig: string
  derivedVia: string
  signedMessage: string
  address: string
}

export async function generateAuthSig(
  signer: Signer,
  chainId: number,
  auctionId: number,
): Promise<AuthSig> {
  const address = await signer.getAddress()
  const siweMessage = new SiweMessage({
    domain: 'gnosisauction',
    address: address,
    statement: `Sign in to access bidding for auction - ${auctionId}`,
    uri: origin,
    version: '1',
    chainId: chainId,
  })

  const messageToSign = siweMessage.prepareMessage()
  const signature = await signer.signMessage(messageToSign)

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: address,
  }
  return authSig
}
