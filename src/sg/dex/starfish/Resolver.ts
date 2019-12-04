import Provider from "./Providers/MetamaskProvider";
const Web3 = require('web3');

class Resolver {
    private web3;
    private provider;

    constructor(provider: Provider) {
        this.provider = provider;
    }

    initialize() {
        this.web3 = new Web3(this.provider.getProvider());
    }

    stop() {
        this.provider.stop();
        delete this.provider;
    }

    register(did: string, ddo: string) {
        this.web3;
    }

    resolve(did: string)
    {

    }
}
export default Resolver;