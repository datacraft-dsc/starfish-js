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

    constructor(endpoint: string) {
        this.provider = Web3.providers.HttpProvider(endpoint);
    }
}
export default DirectProvider;