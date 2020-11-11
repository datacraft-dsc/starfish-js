import { ContractBase } from './ContractBase'
import { TransactionReceipt } from 'web3-core'

import { EthereumAccount } from '../EthereumAccount'

export class DispenserContract extends ContractBase {
    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: EthereumAccount, amount: number): Promise<TransactionReceipt> {
        return this.sendToContract(this.contract.methods.requestTokens(amount), account)
    }
}
