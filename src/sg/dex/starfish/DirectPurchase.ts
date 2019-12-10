const Web3 = require('web3');
import Provider from "./Providers/ProviderInterface";

class DirectPurchase {
    private web3;
    private directPurchase;
    private provider;

    constructor(provider: Provider) {
      this.provider = provider;
      this.web3 = new Web3(this.provider.getProvider());
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

    async sendTokenAndLog() {
      await this.web3.currentProvider;
      let txHash;
      try {
        txHash = await this.directPurchase.methods.sendTokenAndLog('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', 10, Web3.utils.fromAscii("1234"), Web3.utils.fromAscii("1234")).send({ from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1' });
      } catch (err) {
        return null;
      }
      let txReceipt;
      try {
        txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
      } catch (err) {
        return null;
      }
      return txReceipt;
  }

  async shutdown() {
    await this.web3.currentProvider;
    return this.provider.stop();
  }
}
export default DirectPurchase;