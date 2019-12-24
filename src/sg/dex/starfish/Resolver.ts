import Provider from "./Providers/ProviderInterface";
const Web3 = require('web3');
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"


class Resolver {
    private web3;
    private provider;
    private contract;
    private accountFrom;

    constructor(provider: Provider, accountFrom: string) {
        this.provider = provider;
        this.web3 = new Web3(this.provider.getProvider());
        this.accountFrom = accountFrom;
        const config = new Config();
        this.contract = Ocean.getInstance(config).then (async (ocean)=> {
            const squidInstance = await ocean.getSquid();
            return squidInstance.keeper.didRegistry;
        });
    }

    async shutdown() {
        await this.web3.currentProvider;
        await this.contract;
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