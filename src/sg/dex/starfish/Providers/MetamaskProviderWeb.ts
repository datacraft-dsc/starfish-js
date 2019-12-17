import Provider from "./ProviderInterface"; 
declare let window: any;

class MetamaskProviderWeb implements Provider {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    async checkIfProviderEnabled(web3: any) {
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            try {
                const accounts = await web3.currentProvider.enable();
                web3.eth.defaultAccount = accounts[0];
                return true;
            } catch (error) {
                if (error.code === 4001) {
                    console.warn('You need to connect MetaMask to use this dapp');
                } else {
                    console.error(error);
                }
            }
            console.warn('MetaMask is locked');
            return false;
        }
        return true;
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