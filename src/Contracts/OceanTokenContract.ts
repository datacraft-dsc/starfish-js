
import AContract from './AContract'


export default class OceanTokenContract extends AContract {
    
    constructor() {
        super('OceanToken')
    }

    async getBalance(account_address): Promise<string> {
        let address = this.getAccountAddress(account_address)
        let amountWei = await this.contract.methods.balanceOf().call(address)
        return this.toEther(amountWei)
    }
}
