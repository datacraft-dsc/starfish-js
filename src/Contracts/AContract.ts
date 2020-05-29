import Web3 from 'web3'
import { Contract as Web3Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import Account from '../Account'

export default abstract class AContract {
    private name: string
    private abi: AbiItem[]
    private address: string
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
            address = (<Account>accountAddress).getAddress()
        }
        return address
    }

    public async waitForReceipt(txHash: string): Promise<any> {
        return await this.web3.eth.getTransactionReceipt(txHash)
    }

    public toEther(amountWei: string): string {
        return this.web3.utils.fromWei(amountWei, 'ether')
    }
    public getName(): string {
        return this.name
    }
    public getWeb3(): Web3 {
        return this.web3
    }
    public getAbi(): AbiItem[] {
        return this.abi
    }
    public getAddress(): string {
        return this.address
    }
    public getWeb3Contract(): Web3Contract {
        return this.contract
    }
}
