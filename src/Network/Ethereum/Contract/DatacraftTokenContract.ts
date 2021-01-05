import { TransactionReceipt } from 'web3-core'

import { ContractBase } from './ContractBase'
import { EthereumAccount } from '../EthereumAccount'
import { toEther, toWei } from '../../../Utils'

export class DatacraftTokenContract extends ContractBase {
    constructor() {
        super('DatacraftToken')
    }

    public async getBalance(accountAddress: EthereumAccount | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.contract.methods.balanceOf(address).call()
        return toEther(amountWei)
    }
    public async transfer(
        account: EthereumAccount,
        toAccountAddress: EthereumAccount | string,
        amount: number | string
    ): Promise<TransactionReceipt> {
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        return this.sendToContract(this.contract.methods.transfer(toAddress, amountWei), account)
    }

    public async approveTransfer(
        account: EthereumAccount,
        toAccountAddress: EthereumAccount | string,
        amount: number | string
    ): Promise<TransactionReceipt> {
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        return this.sendToContract(this.contract.methods.approve(toAddress, amountWei), account)
    }

    public async getTotalSupply(): Promise<string> {
        const amountWei = await this.contract.methods.totalSupply().call()
        return toEther(amountWei)
    }
}
