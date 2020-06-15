import { ContractBase } from './ContractBase'
import { Account } from 'starfish/Account'
import { TransactionReceipt } from 'web3-core'

export class DispenserContract extends ContractBase {
    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: Account, amount: number): Promise<TransactionReceipt> {
        return this.sendToContract(this.contract.methods.requestTokens(String(amount)), account)
    }
}
