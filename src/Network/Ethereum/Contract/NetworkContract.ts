import { TransactionReceipt } from 'web3-core'

import { ContractBase } from './ContractBase'
import { EthereumAccount } from '../EthereumAccount'
import { toWei, toEther } from '../../../Utils'

export class NetworkContract extends ContractBase {
    constructor() {
        super('NetworkToken')
    }

    public async getBalance(accountAddress: EthereumAccount | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.web3.eth.getBalance(address)
        return toEther(amountWei)
    }

    public async sendEther(
        account: EthereumAccount,
        toAccountAddress: EthereumAccount | string,
        amount: number | string
    ): Promise<TransactionReceipt> {
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        const transaction = {
            from: account.address,
            to: toAddress,
            value: amountWei,
        }
        return this.sendTransaction(transaction, account)
    }
}
