import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'
import MetaMaskConnector from 'node-metamask'

import IProvider from './IProvider'

/**
 * This provider connects to opened websocket of Metamask.
 * To accept incoming connection it requires user action to go to URL http://localhost:3333 in browser.
 * Thats why MetamaskProvider excluded from autotesting.
 * Technically Metamask extension in browser can open port not only for localhost but for external network.
 * This is not recommended due potential security breach.
 */
export class MetamaskProvider implements IProvider {
    private connector: MetaMaskConnector

    /**
     * Constructs the MetamaskProvider
     */
    constructor() {
        this.connector = new MetaMaskConnector({
            port: 3333, // this is the default port
            onConnect() {
                console.log('MetaMask client connected')
            }, // Function to run when MetaMask is connected (optional)
        })
    }

    public getProvider(): Web3Provider {
        return this.connector.start().then(() => {
            // Now go to http://localhost:3333 in your MetaMask enabled web browser.
            return this.connector.getProvider()
        })
    }

    public async checkIfProviderEnabled(web3: Web3): Promise<boolean> {
        await web3.currentProvider
        return true
    }

    /**
     * This provider requires manual shutting down.
     * Because internally it opens infinite cycle.
     * Otherwise it will hang.
     */
    public stop(): void {
        return this.connector.stop()
    }
}
