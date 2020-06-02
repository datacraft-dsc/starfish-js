import ContractBase from './ContractBase'
import Account from '../Account'
import { toEther } from '../Helpers'

export default class OceanTokenContract extends ContractBase {
    constructor() {
        super('OceanToken')
    }

    public async getBalance(accountAddress: Account | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.contract.methods.balanceOf(address).call()
        return toEther(amountWei)
    }
}
