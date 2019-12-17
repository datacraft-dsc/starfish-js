const MetaMaskConnector = require('node-metamask');
import Provider from "./ProviderInterface"; 

class MetamaskProvider implements Provider {
    private connector;
    getProvider()
    {
        return this.connector.start().then(() => {
            // Now go to http://localhost:3333 in your MetaMask enabled web browser.
            return this.connector.getProvider();
        });
    }

    async checkIfProviderEnabled(web3: any) {
        await web3.currentProvider;
        return true;
    }

    stop() {
        return this.connector.stop();
    }

    constructor() {
        this.connector = new MetaMaskConnector({
            port: 3333, // this is the default port
            onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
            });
    }
}
export default MetamaskProvider;