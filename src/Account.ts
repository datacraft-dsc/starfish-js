/*


    Account

*/

import fs from 'fs-extra'
import Web3 from 'web3'

import { toChecksumAddress } from 'web3-utils'
import {EncryptedKeystoreV3Json} from 'web3-core'

export default class Account {

    private address: string
    private password: string
    private keyFilename: string
    private keyData: EncryptedKeystoreV3Json

    public static createNew(password: string, entropy?: string): Account {
        const web3 = new Web3()
        const result = web3.eth.accounts.create(entropy)
        const address = result.address
        const keyData = web3.eth.accounts.encrypt(result.privateKey, password)
        return new Account(address, password, null, keyData)
    }

    public static async loadKeyFileFromFile( filename: string): Promise<EncryptedKeystoreV3Json> {
        let data = null
        if (fs.pathExists(filename)) {
            const rawData = await fs.readFile(filename)
            data = JSON.parse(rawData)
        }
        return data
    }

    public static async createFromFile(password: string, filename: string): Promise<Account> {
        const web3 = new Web3()
        const data = await Account.loadKeyFileFromFile(filename)
        if (data) {
            const keyData = await web3.eth.accounts.decrypt(data, password)
            return new Account(keyData.address, password, filename, data)
        }
        return null
    }

    constructor(address?: string, password?: string, keyFilename?: string, keyData?: EncryptedKeystoreV3Json) {
        this.address = address
        this.password = password
        this.keyFilename = keyFilename
        this.keyData = keyData
    }


    public async saveToFile(filename: string): Promise<any> {
        const data = JSON.stringify(this.keyData)
        return await fs.writeFile(filename, data)
    }

    public async signTransaction(web3: Web3, transaction: unknown): Promise<any> {
        // decode the keyData to find out the private key
        const data = await web3.eth.accounts.decrypt(this.keyData, this.password)
        return await web3.eth.accounts.signTransaction(transaction, data.privateKey)
    }

    public exportKey(): string {
        return JSON.stringify(this.keyData)
    }

    public importKey(privateKey: string, password: string): void {
        const web3 = new Web3()
        this.keyData = web3.eth.accounts.encrypt(privateKey, password)
    }
    public isAddressEqual(address: string): boolean {
        return toChecksumAddress(address) === this.getChecksumAddress()
    }
    public isPassword(): boolean {
        return this.password != null
    }
    public getAddress(): string {
        return this.address
    }
    public getChecksumAddress(): string {
        return toChecksumAddress(this.address)
    }
    public getPassword(): string {
        return this.password
    }
    public getKeyFilename(): string {
        return this.keyFilename
    }
    public getKeyData(): EncryptedKeystoreV3Json {
        return this.keyData
    }
}
