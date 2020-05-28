/*


    Account

*/

import fs from 'fs-extra'
import Web3 from 'web3'

import { toChecksumAddress } from 'web3-utils'


export default class Account {

    private address: string
    private password: string
    private keyFilename: string
    private keyData: any

    public static createNew(password: string, entropy?: string): Account {
        let web3 = new Web3()
        let result = web3.eth.accounts.create(entropy)
        let address = result.address
        let keyData = web3.eth.accounts.encrypt(result.privateKey, password)
        return new Account(address, password, null, keyData)
    }

    public static async loadKeyFileFromFile( filename: string) {
        let data = null
        if (fs.pathExists(filename)) {
            let rawData = await fs.readFile(filename)
            data = JSON.parse(rawData)
        }
        return data
    }

    public static async createFromFile(password: string, filename: string): Promise<Account> {
        let web3 = new Web3()
        let data = await Account.loadKeyFileFromFile(filename)
        if (data) {
            let keyData = await web3.eth.accounts.decrypt(data, password)
            return new Account(keyData.address, password, filename, data)
        }
        return null
    }

    constructor(address?: string, password?: string, keyFilename?: string, keyData?: any) {
        this.address = address
        this.password = password
        this.keyFilename = keyFilename
        this.keyData = keyData
    }


    async saveToFile(filename: string): Promise<any> {
        let data = JSON.stringify(this.keyData)
        return await fs.writeFile(filename, data)
    }

    async signTransaction(web3: Web3, transaction: object): Promise<object> {
        // decode the keyData to find out the private key
        let data = await web3.eth.accounts.decrypt(this.keyData, this.password)
        return await web3.eth.accounts.signTransaction(transaction, data.privateKey)
    }

    exportKey(): string {
        return JSON.stringify(this.keyData)
    }

    importKey(privateKey: string, password: string) {
        let web3 = new Web3()
        this.keyData = web3.eth.accounts.encrypt(privateKey, password)
    }
    isAddressEqual(address: string) {
        return toChecksumAddress(address) === this.getChecksumAddress()
    }
    isPassword(): boolean {
        return this.password != null
    }
    getAddress(): string {
        return this.address
    }
    getChecksumAddress(): string {
        return toChecksumAddress(this.address)
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
