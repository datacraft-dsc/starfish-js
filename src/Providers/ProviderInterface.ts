/**
 * Web3 provider interface
 */
export default interface ProviderInterface {
    /**
     * Simply getter
     */
    getProvider(): Object;
    /**
     * Depends on the implementation. 
     * Several providers might have special requirements to shut them down manually.
     */
    stop(): void;
    /**
     * Pull/update/renew provider status.
     * Depends on the implementation.
     * It might be reconnect, or might be some user action to enable provider
     *
     * @param web3 
     * @return Promise with boolean result. True if provider is ready for work.
     */
    checkIfProviderEnabled(web3: any): Promise<boolean>;
}
