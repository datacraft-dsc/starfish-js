import Provider from "./Providers/ProviderInterface";
const Web3 = require('web3');
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"


class Resolver {
    private web3;
    private provider;
    private contract;
    private accountFrom;

    constructor(provider: Provider, accountFrom?: string) {
        this.provider = provider;
        this.web3 = new Web3(this.provider.getProvider());
        this.accountFrom = accountFrom ? accountFrom: this.web3.eth.defaultAccount;
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
        const contract = await this.contract;
        return contract.registerAttribute(did, did, [], ddo, this.accountFrom);
    }

    async resolve(did: string)
    {
        await this.web3.currentProvider;
        const contract = await this.contract;
        let blockNumber = await contract.getBlockNumberUpdated(did);
        let _filter = {_did: ['0x' + did]};

        let events = await contract.contract.getPastEvents('DIDAttributeRegistered',
        {
            filter: _filter,
            fromBlock: blockNumber,
            toBlock: blockNumber
        });

        return events.length === 1 ? events[0].returnValues._value : null;
    }
}
export default Resolver;