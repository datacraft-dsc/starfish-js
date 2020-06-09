import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'

import IProvider from './IProvider'

// eslint-disable-next-line
declare let window: any;


/**
 * This provider uses injected web3 object to existing page in browser.
 * Metamask extension injects web3 object only on the page which is being run on http server.
 * It does not inject for local file:// protocol
 */
export class MetamaskProviderWeb implements IProvider {
    private provider: Web3Provider

    /**
     * Constructs the MetamaskProviderWeb
     * Check if Metamask extension is installed in browser and if not prints message into console.
     */
    constructor() {
        if (typeof window['ethereum'] !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.provider = window['ethereum']
        } else {
            console.warn('Please use a dapp browser like mist or MetaMask plugin for chrome')
            return
        }

        if (window['ethereum'].isMetaMask !== true) {
            console.warn('Current provider is not MetaMask')
        }
    }

    public getProvider(): Web3Provider {
        return this.provider
    }

    public stop(): void {
        // do nothing
    }

    /**
     * Pull/update/renew provider status.
     * Checks if Metamask extension is enabled and if not tries to enable.
     * Pull accounts details from metamask and activate default account which is choosen in Metamask extension in browser by user
     *
     * @param web3
     * @return Promise with boolean result. True if provider is ready for work.
     */
    public async checkIfProviderEnabled(web3: Web3): Promise<boolean> {
        const accounts = await web3.eth.getAccounts()

        if (accounts.length === 0) {
            try {
                const accounts = await web3.eth.getAccounts()
                web3.eth.defaultAccount = accounts[0]
                return true
            } catch (error) {
                if (error.code === 4001) {
                    console.warn('You need to connect MetaMask to use this dapp')
                } else {
                    console.error(error)
                }
            }
            console.warn('MetaMask is locked')
            return false
        }
        web3.eth.defaultAccount = accounts[0]
        return true
    }
}
