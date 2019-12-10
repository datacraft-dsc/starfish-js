import Provider from "./Providers/MetamaskProvider";
const Web3 = require('web3');

class Resolver {
    private web3;
    private provider;

    constructor(provider: Provider) {
        this.provider = provider;
        this.web3 = new Web3(this.provider.getProvider());
    }

    async shutdown() {
        await this.web3.currentProvider;
        return this.provider.stop();
    }

    async register(did: string, ddo: string) {
        await this.web3.currentProvider;
    }

    async resolve(did: string)
    {
        await this.web3.currentProvider;
    }
}
export default Resolver;