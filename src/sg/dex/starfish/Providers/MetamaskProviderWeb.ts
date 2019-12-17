import Provider from "./ProviderInterface"; 
declare let window: any;

class MetamaskProviderWeb implements Provider {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    stop() {
    }

    constructor() {
        if (typeof window["ethereum"] !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.provider = window["ethereum"];

        } else {
            console.warn('Please use a dapp browser like mist or MetaMask plugin for chrome');
            return;
        }

        if (window["ethereum"].isMetaMask !== true) {
            console.warn('Current provider is not MetaMask');
        }
    }
}
export default MetamaskProviderWeb;