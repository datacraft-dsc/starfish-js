import ContractBase from './ContractBase'
import Account from '../Account'
import { TransactionReceipt } from 'web3-core'

export default class DispenserContract extends ContractBase {
    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: Account, amount: number): Promise<TransactionReceipt> {
        console.log(amount)
        const amountValue = this.web3.utils.numberToHex(amount.toLocaleString())
        console.log(amountValue, account.checksumAddress)
        return this.callAsTransaction(this.contract.methods.requestTokens(String(amount)), account)
        // return this.contract.methods.requestTokens(amount).send({ from: account.getAddress() })
    }
}
