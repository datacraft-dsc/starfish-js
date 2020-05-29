
import AContract from './AContract'
import Account from '../Account'


export default class DispenserContract extends AContract {

    constructor() {
        super('Dispense')
    }

    public async requestTokens(account: Account, amount: number): Promise<any> {
        return await this.contract.methods.requestTokens(amount).send({'from': account.getChecksumAddress()})
    }
}
