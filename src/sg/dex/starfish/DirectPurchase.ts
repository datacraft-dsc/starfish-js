const Web3 = require('web3');
import Provider from "./Providers/ProviderInterface";
import Config from "../../../Config"
import Ocean from "../../../../src/Ocean"
let contract_artifacts;
try {
  contract_artifacts = require('../../../../artifacts/DirectPurchase.spree.json');
} catch (e) {
  contract_artifacts = null;
}
class DirectPurchase {
    private web3;
    private directPurchase;
    private provider;
    private token;
    private subscription;

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
      const direct_purchase_address = contract_artifacts ? contract_artifacts.address: config.values['direct_purchase_contract'];
      this.directPurchase = new this.web3.eth.Contract(abi, direct_purchase_address);
      this.token = Ocean.getInstance(config).then (async (ocean)=> {
        const squidInstance = await ocean.getSquid();
        return squidInstance.keeper.token;
      });
    }
    async sendTokenAndLog(accountTo: string, amount: number, reference1: string, reference2: string, _accountFrom?: string) {
      const enabled = await this.provider.checkIfProviderEnabled(this.web3);
      if(!enabled)
        return;
      const accountFrom = _accountFrom ? _accountFrom: this.web3.eth.defaultAccount;
      const token = await this.token;
      let txReceipt;
      try {
        txReceipt = await token.approve(this.directPurchase._address, amount, accountFrom);
      } catch (err) {
        return null;
      }
      if(txReceipt.status !== true)
        return null;
      try {
        txReceipt = await this.directPurchase.methods.sendTokenAndLog(accountTo, amount, Web3.utils.fromAscii(reference1), Web3.utils.fromAscii(reference2)).send({ from: accountFrom });
      } catch (err) {
        return null;
      }

      return txReceipt;
  }

  async shutdown() {
    await this.provider.checkIfProviderEnabled(this.web3);
    return this.provider.stop();
  }

  async unsubscribe() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

  async subscribe(publisher, reference, element) {
    const enabled = await this.provider.checkIfProviderEnabled(this.web3);
    if(!enabled)
      return;
    await this.unsubscribe();
    const _filter = {_from: [this.web3.eth.defaultAccount], _to: [publisher], _reference2: ['0x' + reference]};
    this.subscription = this.directPurchase.events.TokenSent({
      fromBlock: 0,
      toBlock: "latest",
      filter: _filter,
      }, function(error, event){
        console.log(event);
      })
      .on('data', function(event){
        element.innerHTML = element.innerHTML + JSON.stringify(event);
      })
      .on('changed', function(event){
        console.log(event);
      })
      .on('error', function(event){
        console.log(event);
      });
    }
}
export default DirectPurchase;