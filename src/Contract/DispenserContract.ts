import { ContractBase } from './ContractBase'
import { TransactionReceipt } from 'web3-core'

import { Account } from '../Account'

export class DispenserContract extends ContractBase {
    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: Account, amount: number): Promise<TransactionReceipt> {
        return this.sendToContract(this.contract.methods.requestTokens(amount), account)
    }
}
