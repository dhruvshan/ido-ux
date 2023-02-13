import * as LitJsSdk from '@lit-protocol/lit-node-client'

import { ChainId } from '.'

const client = new LitJsSdk.LitNodeClient({ debug: true })

type EncryptedContent = {
  encryptedString: any
  encryptedSymmetricKey: any
}

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient | null = null

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  async decryptString(
    { encryptedString, encryptedSymmetricKey }: EncryptedContent,
    accessControlConditions: any,
    chain: string,
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const symmetricKey = await this.litNodeClient!.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    const decryptedString = await LitJsSdk.decryptString(
      await LitJsSdk.base64StringToBlob(encryptedString),
      symmetricKey,
    )
    return decryptedString
  }
}

export const getChainName = (chainId: number) => {
  return (
    (chainId === ChainId.GÖRLI && 'goerli') ||
    (chainId === ChainId.MAINNET && 'ethereum') ||
    (chainId === ChainId.XDAI && 'xdai') ||
    (chainId === ChainId.MATIC && 'polygon') ||
    'ethereum'
  )
}

export default new Lit()
