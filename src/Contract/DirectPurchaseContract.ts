import { TransactionReceipt } from 'web3-core'
import { EventData } from 'web3-eth-contract'
import { toHex } from 'web3-utils'

import { ContractBase } from './ContractBase'
import { Account } from '../Account'
import { toWei } from '../Helpers'

export class DirectPurchaseContract extends ContractBase {
    constructor() {
        super('DirectPurchase')
    }

    public async sendTokenWithLog(
        account: Account,
        toAccountAddress: Account | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<TransactionReceipt> {
        if (!reference1) {
            reference1 = ''
        }
        if (!reference2) {
            reference2 = ''
        }
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        const ref1Bytes = toHex(reference1)
        const ref2Bytes = toHex(reference2)
        return this.sendToContract(this.contract.methods.sendTokenAndLog(toAddress, amountWei, ref1Bytes, ref2Bytes), account)
    }

    public async getEventLogs(
        fromAccountAddress: Account | string,
        toAccountAddress: Account | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<EventData[]> {
        const fromAddress = this.getAccountAddress(fromAccountAddress)
        const toAddress = this.getAccountAddress(toAccountAddress)
        const amountWei = toWei(amount)
        const filter = {
            _from: fromAddress,
            _to: toAddress,
            _amount: amountWei,
        }
        if (reference1) {
            filter['_reference1'] = toHex(reference1)
        }
        if (reference2) {
            filter['_reference2'] = toHex(reference2)
        }
        return this.contract.getPastEvents('TokenSent', {
            filter: filter,
            fromBlock: 0,
            toBlock: 'latest',
        })
    }
}
