import Provider from "./ProviderInterface";
const Web3 = require('web3');

/**
 * Web3 provider which uses WebSocket
 * WebSocket provider is the only provider which does suport listening/subscribtion for events. 
 */
class WebSocketProvider implements Provider {
    private provider;
    getProvider()
    {
        return this.provider;
    }

    stop() {
        this.provider.connection.close();
    }

    async checkIfProviderEnabled(web3: any) {
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
export default WebSocketProvider;