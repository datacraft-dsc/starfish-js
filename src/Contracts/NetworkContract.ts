
import AContract from './AContract'
import Account from '../Account'


export default class NetworkContract extends AContract {

    constructor() {
        super('NetworkToken')
    }

    async getBalance(accountAddress: Account | string): Promise<string> {
        let address = this.getAccountAddress(accountAddress)
        let amountWei = await this.web3.eth.getBalance(address)
        return this.toEther(amountWei)
    }
}

