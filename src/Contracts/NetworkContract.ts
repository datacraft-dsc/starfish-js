
import AContract from './AContract'


export default class NetworkContract extends AContract {

    constructor() {
        super('NetworkToken')
    }

    async getBalance(account_address): Promise<string> {
        let address = this.getAccountAddress(account_address)
        let amountWei = await this.web3.eth.getBalance(address)
        return this.toEther(amountWei)
    }
}

