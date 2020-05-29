import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'

import IProvider from './IProvider'

/**
 * Web3 provider which uses direct HttpProvider
 * HttpProvider does not suport listening/subscribtion for events.
 */
export default class DirectProvider implements IProvider {
    private provider: Web3Provider

    /**
     * Constructs the DirectProvider
     * @param endpoint: Url to connect to Ethereum RPC node.
     */
    constructor(endpoint: string) {
        this.provider = new Web3.providers.HttpProvider(endpoint)
    }

    public getProvider(): Web3Provider {
        return this.provider
    }

    public stop(): void {
        // do nothing
    }

    public async checkIfProviderEnabled(web3: Web3): Promise<boolean> {
        const accounts = await web3.eth.getAccounts()
        web3.eth.defaultAccount = accounts[0]
        return true
    }
}
