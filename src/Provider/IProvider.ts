/**
 * Web3 provider interface
 */

import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'

export interface IProvider {
    /**
     * Simply getter
     */
    getProvider(): Web3Provider

    /**
     * Depends on the implementation.
     * Several providers might have special requirements to shut them down manually.
     */
    stop(): void

    /**
     * Pull/update/renew provider status.
     * Depends on the implementation.
     * It might be reconnect, or might be some user action to enable provider
     *
     * @param web3
     * @return Promise with boolean result. True if provider is ready for work.
     */
    checkIfProviderEnabled(web3: Web3): Promise<boolean>
}
