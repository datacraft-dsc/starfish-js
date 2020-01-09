const Web3 = require('web3');
import Provider from "./Providers/ProviderInterface";
let direct_purchase_artifacts;
try {
  direct_purchase_artifacts = require('../../../../artifacts/DirectPurchase.spree.json');
} catch (e) {
  direct_purchase_artifacts = null;
}
let token_artifacts;
try {
  token_artifacts = require('../../../../artifacts/OceanToken.spree.json');
} catch (e) {
  token_artifacts = null;
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
      this.directPurchase = new this.web3.eth.Contract(direct_purchase_artifacts.abi, direct_purchase_artifacts.address);
      this.token = new this.web3.eth.Contract(token_artifacts.abi, token_artifacts.address);
    }
    async sendTokenAndLog(accountTo: string, amount: number, reference1: string, reference2: string, _accountFrom?: string) {
      const enabled = await this.provider.checkIfProviderEnabled(this.web3);
      if(!enabled)
        return;
      const accountFrom = _accountFrom ? _accountFrom: this.web3.eth.defaultAccount;
      let txReceipt;
      try {
        txReceipt = await this.token.methods.approve(this.directPurchase._address, amount).send({ from: accountFrom });
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
    element.innerHTML = "";
    const _filter = {_from: [this.web3.eth.defaultAccount], _to: [publisher], _reference2: [Web3.utils.fromAscii(reference)]};
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