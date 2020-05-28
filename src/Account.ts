/*


    Account

*/

import fs from 'fs-extra'
import path from 'path'
import Web3 from 'web3'


export default class Account {

    private address: string
    private password: string
    private keyFilename: string
    private keyData: Object

    public static createNew(password: string, entropy?: string): Account {
        let web3 = new Web3()
        let result = web3.eth.accounts.create(entropy)        
        let address = result.address
        let keyData = web3.eth.accounts.encrypt(result.privateKey, password)
        return new Account(address, password, null, keyData)
    }

    
    constructor(address?: string, password?: string, keyFilename?: string, keyData?: Object) {
        this.address = address
        this.password = password
        this.keyFilename = keyFilename
        this.keyData = keyData
        if (this.keyFilename) {
            this.loadKeyFile(this.keyFilename)
        }
    }


    loadKeyFile(filename: string) {
        if (fs.pathExists(filename)) {
            this.keyData = import(path.join('../', filename))
        }
    }

    
    getAddress(): string {
        return this.address
    }
    getPassword(): string {
        return this.password
    }
    getKeyFilename(): string {
        return this.keyFilename
    }
    getKeyData(): Object {
        return this.keyData
    }
}
