import AContract from './AContract'
import Account from '../Account'

export default class DispenserContract extends AContract {
    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: Account, amount: number): Promise<any> {
        console.log(amount)
        const amountValue = this.web3.utils.numberToHex(amount.toLocaleString())
        console.log(amountValue, account.getChecksumAddress())
        return this.callAsTransaction(this.contract.methods.requestTokens(String(amount)), account)
//        return this.contract.methods.requestTokens(amount).send({ from: account.getAddress() })
    }
}
