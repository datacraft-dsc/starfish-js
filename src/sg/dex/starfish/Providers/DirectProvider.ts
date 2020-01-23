import Provider from "./ProviderInterface";
const Web3 = require('web3');

/**
 * Web3 provider which uses direct HttpProvider
 * HttpProvider does not suport listening/subscribtion for events. 
 */
class DirectProvider implements Provider {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    stop() {
    }

    async checkIfProviderEnabled(web3: any) {
        const accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        return true;
    }

    /**
     * Constructs the DirectProvider
     * @param endpoint: Url to connect to Ethereum RPC node.
     */
    constructor(endpoint: string) {
        this.provider = new Web3.providers.HttpProvider(endpoint);
    }
}
export default DirectProvider;