import Web3 from 'web3'
import ProviderInterface from "./ProviderInterface";

/**
 * Web3 provider which uses WebSocket
 * WebSocket provider is the only provider which does suport listening/subscribtion for events. 
 */
export default class WebSocketProvider implements ProviderInterface {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    stop() {
        this.provider.connection.close();
    }

    async checkIfProviderEnabled(web3: any) {
        const accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        return true;
    }

    /**
     * Constructs the WebSocketProvider
     * @param endpoint: WS url to connect to Ethereum RPC node.
     */
    constructor(endpoint: string) {
        this.provider = new Web3.providers.WebsocketProvider(endpoint);
    }
}
