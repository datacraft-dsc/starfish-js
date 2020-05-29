import AContract from './AContract'
import Account from '../Account'

export default class NetworkContract extends AContract {
    constructor() {
        super('NetworkToken')
    }

    public async getBalance(accountAddress: Account | string): Promise<string> {
        const address = this.getAccountAddress(accountAddress)
        const amountWei = await this.web3.eth.getBalance(address)
        return this.toEther(amountWei)
    }
}
