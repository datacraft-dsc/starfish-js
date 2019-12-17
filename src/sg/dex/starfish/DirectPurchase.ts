const Web3 = require('web3');
import Provider from "./Providers/ProviderInterface";
import Config from "../../../Config"

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
      const config = new Config();
      this.directPurchase = new this.web3.eth.Contract(abi, config.values['direct_purchase_contract']);
    }

    async sendTokenAndLog(accountFrom: string, accountTo: string, amount: number, reference1: string, reference2: string) {
      const enabled = await this.provider.checkIfProviderEnabled(this.web3);
      if(!enabled)
        return;

      let txHash;
      try {
        txHash = await this.directPurchase.methods.sendTokenAndLog(accountTo, amount, Web3.utils.fromAscii(reference1), Web3.utils.fromAscii(reference2)).send({ from: accountFrom });
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
    await this.provider.checkIfProviderEnabled(this.web3);
    return this.provider.stop();
  }
}
export default DirectPurchase;