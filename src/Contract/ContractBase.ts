import Web3 from 'web3'
import { Contract as Web3Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
// import { TransactionReceipt } from 'web3-core'
import { ContractSendMethod } from 'web3-eth-contract'

import Account from '../Account'

export default class ContractBase {
    readonly name: string
    public abi: AbiItem[]
    public address: string
    protected web3: Web3
    protected contract: Web3Contract

    constructor(name: string) {
        this.name = name
    }

    public load(web3: Web3, abi?: AbiItem[], address?: string): void {
        this.web3 = web3
        this.abi = abi
        this.address = address
        if (abi && address) {
            this.contract = new web3.eth.Contract(abi, address)
        }
    }

    public getAccountAddress(accountAddress: Account | string): string {
        let address = <string>accountAddress
        if (typeof accountAddress === 'object' && accountAddress.constructor.name === 'Account') {
            address = (<Account>accountAddress).address
        }
        return address
    }

    public async sendToContract(contractMethod: ContractSendMethod, account: Account): Promise<any> {
        const gasTransaction = { from: account.checksumAddress }
        const estimatedGas = await contractMethod.estimateGas(gasTransaction)
        if (account.isLocal) {
            const transaction = {
                from: account.address,
                to: this.address,
                gas: estimatedGas,
                data: contractMethod.encodeABI(),
            }
            // local account, that needs to sign the transaction and then send
            const signedTransaction = await account.signTransaction(this.web3, transaction)
            return this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        } else {
            const transaction = {
                from: account.address,
                gas: estimatedGas,
            }
            // the account is on the node, so send to the node, for the node to sign
            return contractMethod.send(transaction)
        }
    }
    public async sendTransaction(transaction: any, account: Account): Promise<any> {
        const estimatedGas = await this.web3.eth.estimateGas(transaction)
        transaction['gas'] = estimatedGas

        if (account.isLocal) {
            // local account, that needs to sign the transaction and then send
            const signedTransaction = await account.signTransaction(this.web3, transaction)
            return this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        } else {
            // the account is on the node, so send to the node, for the node to sign
            return this.web3.eth.sendTransaction(transaction)
        }
    }
}
