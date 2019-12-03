const MetaMaskConnector = require('node-metamask');
const Web3 = require('web3');

class DirectPurchase {
    private connector;
    private web3;
    private directPurchase;

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

            const abi = [
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "name": "_from",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "name": "_to",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "name": "_amount",
                    "type": "uint256"
                  },
                  {
                    "indexed": false,
                    "name": "_reference1",
                    "type": "bytes32"
                  },
                  {
                    "indexed": true,
                    "name": "_reference2",
                    "type": "bytes32"
                  }
                ],
                "name": "TokenSent",
                "type": "event"
              },
              {
                "constant": false,
                "inputs": [
                  {
                    "name": "_token",
                    "type": "address"
                  }
                ],
                "name": "initialize",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "constant": false,
                "inputs": [
                  {
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "name": "amount",
                    "type": "uint256"
                  },
                  {
                    "name": "reference1",
                    "type": "bytes32"
                  },
                  {
                    "name": "reference2",
                    "type": "bytes32"
                  }
                ],
                "name": "sendTokenAndLog",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
              }]
            const contract_address = '0x77D4EB6594CFB2c5F8374C09141f0f7a0397F41b';
            this.directPurchase = this.web3.eth.Contract(abi, contract_address);
            });
    }

    stop() {
        this.connector.stop();
    }

    sendTokenAndLog(did: string, ddo: string) {
        this.directPurchase.sendTokenAndLog('0x413c9ba0a05b8a600899b41b0c62dd661e689354', 10, 0, 0, { from: '0x1936111c43e86Ca38866fe015F58bbEC63c64EC5' })
        .then(async  (txHash) => {
            console.log('Transaction sent');
            console.dir(txHash);
            let txReceipt
            while (!txReceipt) {
            try {
                txReceipt = await this.web3.eth.getTransactionReceipt(txHash)
            } catch (err) {
                // failure
            }
            }
            // successful
        });
    }


}
export default DirectPurchase;