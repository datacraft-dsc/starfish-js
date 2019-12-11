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
        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.provider = window.web3.currentProvider;

        } else {
            console.warn('Please use a dapp browser like mist or MetaMask plugin for chrome');
        }
    }
}
export default MetamaskProviderWeb;