import Provider from "./ProviderInterface";
const Web3 = require('web3');

class DirectProvider implements Provider {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    stop() {
    }

    async checkIfProviderEnabled(web3: any) {
        return true;
    }
    constructor(endpoint: string) {
        this.provider = new Web3.providers.HttpProvider(endpoint);
    }
}
export default DirectProvider;