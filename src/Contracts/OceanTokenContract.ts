
import AContract from './AContract'
import Account from '../Account'

export default class OceanTokenContract extends AContract {

    constructor() {
        super('OceanToken')
    }

    async getBalance(accountAddress: Account | string): Promise<string> {
        let address = this.getAccountAddress(accountAddress)
        let amountWei = await this.contract.methods.balanceOf(address).call()
        return this.toEther(amountWei)
    }
}
