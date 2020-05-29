import AContract from './AContract'
import Account from '../Account'

export default class OceanTokenContract extends AContract {
    constructor() {
        super('OceanToken')
    }

    public async getBalance(accountAddress: Account | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.contract.methods.balanceOf(address).call()
        return this.toEther(amountWei)
    }
}
