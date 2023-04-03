import React from 'react'
import ReactDOM from 'react-dom'

import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'

import { wagmiClient } from './connectors/index'
import { NetworkContextName } from './constants'
import './i18n'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider from './theme'
import { GlobalStyle, ThemedGlobalStyle } from './theme/globalStyle'
import 'sanitize.css'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const getLibrary = (provider: any): Web3Provider => {
  return new Web3Provider(provider)
}

const Updaters = () => {
  return (
    <>
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <WagmiConfig client={wagmiClient}>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <GlobalStyle />
              <ThemedGlobalStyle />
              <App />
            </ThemeProvider>
          </Provider>
        </WagmiConfig>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </>,
  document.getElementById('root'),
)
