
import AContract from './AContract'


export default class OceanTokenContract extends AContract {

    constructor() {
        super('OceanToken')
    }

    async getBalance(accountAddress): Promise<string> {
        let address = this.getAccountAddress(accountAddress)
        let amountWei = await this.contract.methods.balanceOf(address).call()
        return this.toEther(amountWei)
    }
}
