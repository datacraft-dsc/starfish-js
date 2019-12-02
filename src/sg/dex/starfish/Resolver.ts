const MetaMaskConnector = require('node-metamask');
const Web3 = require('Web3');

class Resolver {
    private connector;
    private web3;

    constructor() {
        this.connector = new MetaMaskConnector({
            port: 3333, // this is the default port
            onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
          });

    }

    start() {
        this.connector.start().then(() => {
            // Now go to http://localhost:3333 in your MetaMask enabled web browser.
            this.web3 = new Web3(this.connector.getProvider());
            // Use web3 as you would normally do. Sign transactions in the browser.
            });
    }

    stop() {
        this.connector.stop();
    }
}