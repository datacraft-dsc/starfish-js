import Web3 from 'web3'
import { Contract as Web3Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-core'

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

    public async waitForReceipt(txHash: string): Promise<any> {
        return await this.web3.eth.getTransactionReceipt(txHash)
    }

    public async callAsTransaction(contractMethod: any, account: Account): Promise<TransactionReceipt> {
        const gasTransaction = {'from': account.checksumAddress }
        const estimatedGas = await contractMethod.estimateGas(gasTransaction)
        const transaction = {
            from: String(account.address),
//            this.web3.utils.toChecksumAddress(this.address),
            gas: estimatedGas,
//            data: contractMethod.encodeABI(),
        }
        console.log(transaction)
        return contractMethod.send(transaction)
/*
        const signedTxHash = await account.signTransaction(this.web3, txHash)
        console.log(signedTxHash)
        return this.web3.eth.sendSignedTransaction(signedTxHash.rawTransaction)
*/
    }

    public toEther(amountWei: string): string {
        return this.web3.utils.fromWei(amountWei, 'ether')
    }

}
