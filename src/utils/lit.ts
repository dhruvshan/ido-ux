import * as LitJsSdk from '@lit-protocol/lit-node-client'

import { AuthSig, ChainId } from '.'

const client = new LitJsSdk.LitNodeClient({ debug: true })

export type EncryptedString = {
  encryptedString: string
  encryptedSymmetricKey: string
}

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient | null = null

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  async decryptString(
    { encryptedString, encryptedSymmetricKey }: EncryptedString,
    accessControlConditions: any,
    chain: string,
    authSig: AuthSig,
  ) {
    if (!this.litNodeClient) {
      await this.connect()
    }

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
    (chainId === ChainId.MUMBAI && 'mumbai') ||
    'ethereum'
  )
}

export default new Lit()
