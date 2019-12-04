const Web3 = require('web3');
import Provider from "./Providers/MetamaskProvider";

class DirectPurchase {
    private web3;
    private directPurchase;
    private provider;

    constructor(provider: Provider) {
      this.provider = provider;
    }

    stop() {
      this.provider.stop();
      delete this.provider;
    }

    async initialize() {
      this.web3 = new Web3(await this.provider.getProvider());
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
      this.directPurchase = new this.web3.eth.Contract(abi, contract_address);
    }

    sendTokenAndLog() {
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