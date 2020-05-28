/*


    Account

*/

export default class Account {

    private address: string
    private password: string
    
    constructor(address?: string) {
        this.address = address
    }
    getAddress(): string {
        return this.address
    }
    getPassword(): string {
        return this.password
    }
}
