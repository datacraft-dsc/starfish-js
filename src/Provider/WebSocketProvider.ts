import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'

import { WebsocketProvider } from 'web3-providers-ws'
import { IProvider } from '../Interfaces/IProvider'

/**
 * Web3 provider which uses WebSocket
 * WebSocket provider is the only provider which does suport listening/subscribtion for events.
 */
export class WebSocketProvider implements IProvider {
    private provider: WebsocketProvider

    /**
     * Constructs the WebSocketProvider
     * @param endpoint: WS url to connect to Ethereum RPC node.
     */
    constructor(endpoint: string) {
        this.provider = new Web3.providers.WebsocketProvider(endpoint)
    }

    public getProvider(): Web3Provider {
        return <Web3Provider>this.provider
    }

    public stop(): void {
        this.provider.connection.close()
    }

    public async checkIfProviderEnabled(web3: Web3): Promise<boolean> {
        const accounts = await web3.eth.getAccounts()
        web3.eth.defaultAccount = accounts[0]
        return true
    }
}
