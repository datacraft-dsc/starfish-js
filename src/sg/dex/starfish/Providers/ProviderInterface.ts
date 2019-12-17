interface Provider {
    getProvider(): Object;
    stop(): void;
    checkIfProviderEnabled(web3: any): Promise<boolean>;
}
export default Provider;