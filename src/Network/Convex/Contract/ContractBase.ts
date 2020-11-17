
import { ConvexAccount, ConvexAPI } from '@convex-dev/convex-api-js'
import { prefix0x } from '../../../Utils'

export class ContractBase {
    readonly name: string
    readonly convex: ConvexAPI
    public address: string
    public version: string

    constructor(convex: ConvexAPI, name: string) {
        this.convex = convex
        this.name = name
    }

    public async load(deployAddress: ConvexAccount | string): Promise<void> {
        this.address = await this.getAddress(deployAddress)
        this.version = await this.getVersion(deployAddress)
    }

    public async send(commandLine: string, account: ConvexAccount): Promise<unknown> {
        const transaction = `(call ${this.address} ${commandLine})`
        return this.convex.send(transaction, account)
    }

    public async query(commandLine: string, account: ConvexAccount | string): Promise<unknown> {
        const transaction = `(call ${this.address} ${commandLine})`
        return this.convex.query(transaction, account)
    }

    public async getAddress(deployAddress: ConvexAccount | string): Promise<string> {
        let address = <string>deployAddress
        if (typeof deployAddress === 'object' && deployAddress.constructor.name === 'ConvexAccount') {
            address = (<ConvexAccount>deployAddress).address
        }
        return  prefix0x(await this.convex.getAddress(this.name, address))
    }
    public async getVersion(deployAddress: ConvexAccount | string): Promise<string> {
        let address = this.address
        if (!address) {
            address = prefix0x(await this.getAddress(deployAddress))
        }
        const comandLine = `(call ${address} (version))`
        const result = await this.convex.query(comandLine, deployAddress)
        if (result && result['value']) {
            return result['value']
        }
    }
}
