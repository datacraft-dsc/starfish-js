import { TransactionReceipt } from 'web3-core'

import ContractBase from './ContractBase'
import Account from '../Account'
import { toEther, toWei } from '../Helpers'

export default class OceanTokenContract extends ContractBase {
    constructor() {
        super('OceanToken')
    }

    public async getBalance(accountAddress: Account | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.contract.methods.balanceOf(address).call()
        return toEther(amountWei)
    }
    public async transfer(
        account: Account,
        toAccountAddress: Account | string,
        amount: number | string
    ): Promise<TransactionReceipt> {
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        return this.sendToContract(this.contract.methods.transfer(toAddress, amountWei), account)
    }

    public async getTotalSupply() {
        const amountWei = await this.contract.methods.totalSupply().call()
        return toEther(amountWei)
    }
}

