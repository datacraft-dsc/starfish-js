const MetaMaskConnector = require('node-metamask');
import Provider from "./MetamaskProvider"; 

class MetamaskProvider implements Provider {
    private connector;
    async getProvider()
    {
        await this.connector.start();
        // Now go to http://localhost:3333 in your MetaMask enabled web browser.
        return this.connector.getProvider();
    }

    async stop() {
        await this.connector.stop();
    }

    constructor() {
        this.connector = new MetaMaskConnector({
            port: 3333, // this is the default port
            onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
            });
    }
}
export default MetamaskProvider;