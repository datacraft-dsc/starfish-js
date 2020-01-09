import Provider from "./Providers/ProviderInterface";
const Web3 = require('web3');
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"

/**
 * Resolver implementation
 */
class Resolver {
    private web3;
    private provider;
    private contract;
    private accountFrom;

    /**
     * Constructs the Resolver
     * @param provider: ProviderInterface
     * @param _accountFrom Optional parameter. The account/owner of DID records in blockchain. default is taken from web3 provider's default.
     */
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

    /**
     * Some providers require manual shutting down.
     * Must be called each time upon completion working with Resolver implementation.
     */
    async shutdown() {
        await this.web3.currentProvider;
        await this.contract;
        return this.provider.stop();
    }

    /**
     * Register or update DDO by DID.
     * Update DDO is allowed only by the owner/creator.
     *
     * @param did DID string
     * @param ddo DDO string
     * @return Promise to wait for transaction to be mined.
     */
    async register(did: string, ddo: string) {
        await this.web3.currentProvider;
        const contract = await this.contract;
        return contract.registerAttribute(did, did, [], ddo, this.accountFrom);
    }

    /**
     * Resolve DDO by given DID
     *
     * @param did DID string
     * @return DDO string or null
     */
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