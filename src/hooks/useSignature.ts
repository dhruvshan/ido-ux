import { useEffect, useState } from 'react'

import { useActiveWeb3React } from '.'
import { additionalServiceApi } from '../api'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { generateAuthSig, getSigner } from '../utils'
import lit, { getChainName } from '../utils/lit'
import { getLogger } from '../utils/logger'

const logger = getLogger('useSignature')

export const useSignature = (
  auctionIdentifier: AuctionIdentifier,
  account: string | null | undefined,
): {
  signature: Maybe<string>
} => {
  const { auctionId, chainId } = auctionIdentifier
  const { library } = useActiveWeb3React()
  const [signature, setSignature] = useState<Maybe<string>>(null)

  useEffect(() => {
    let cancelled = false
    const fetchApiData = async () => {
      if (!chainId || !auctionId || !account || !library) {
        return
      }
      const params = {
        networkId: chainId,
        auctionId: auctionId,
        address: account,
      }
      try {
        const signature = await additionalServiceApi.getSignature(params)
        if (cancelled) return

        if (typeof signature === 'string') {
          setSignature(signature)
          return
        }

        const signer = await getSigner(library, account).connectUnchecked()
        const authSig = await generateAuthSig(signer, chainId, auctionId)
        const { encryptedString, encryptedSymmetricKey } = signature
        const accessControlConditions = [
          {
            conditionType: 'evmBasic',
            contractAddress: '',
            standardContractType: '',
            chain: getChainName(params.networkId),
            method: '',
            parameters: [':userAddress'],
            returnValueTest: {
              comparator: '=',
              value: account,
            },
          },
        ]
        const decryptSignature = await lit.decryptString(
          { encryptedString, encryptedSymmetricKey },
          accessControlConditions,
          getChainName(params.networkId),
          authSig,
        )

        if (cancelled) return
        setSignature(decryptSignature)
      } catch (error) {
        if (!cancelled) return
        setSignature(null)
        logger.error('Error getting auction details', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, setSignature, auctionId, chainId, library])

  return { signature }
}
