import { ConvexAccount, ConvexAPI } from '@convex-dev/convex-api-js'

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

    public async getAddress(deployAddress: ConvexAccount | string): Promise<string> {
        let address = <string>deployAddress
        if (typeof deployAddress === 'object' && deployAddress.constructor.name === 'ConvexAccount') {
            address = (<ConvexAccount>deployAddress).address
        }
        return this.convex.getAddress(this.name, address)
    }
    public async getVersion(deployAddress: ConvexAccount | string): Promise<string> {
        let address = this.address
        if (!address) {
            address = await this.getAddress(deployAddress)
        }
        const result = await this.convex.query(`(call ${address} (version)`, deployAddress)
        if (result && result['value']) {
            return result['value']
        }
    }
}
