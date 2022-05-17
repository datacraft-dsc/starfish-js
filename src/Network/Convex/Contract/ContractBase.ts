import { Account as ConvexAccount, API as ConvexAPI, toAddress } from '@convex-dev/convex-api-js'

export class ContractBase {
    readonly convex: ConvexAPI
    public address: BigInt
    public owner: BigInt
    public version: string

    constructor(convex: ConvexAPI) {
        this.convex = convex
    }

    public static escapeString(text: string): string {
        let regexp = new RegExp(/\\\\/, 'g')
        let encodedText = text.replace(regexp, '\\\\\\\\')

        regexp = new RegExp(/"/, 'g')
        encodedText = text.replace(regexp, '\\"')
        return encodedText
    }

    public async send(commandLine: string, account: ConvexAccount): Promise<unknown> {
        const transaction = `(call #${this.address} ${commandLine})`
        return this.convex.send(transaction, account)
    }

    public async query(commandLine: string, addressAccount: ConvexAccount | BigInt | number | string): Promise<unknown> {
        const transaction = `(call #${this.address} ${commandLine})`
        return this.convex.query(transaction, addressAccount)
    }

    public async resolveAddress(name: string): Promise<BigInt> {
        const item = await this.convex.registry.item(name)
        this.address = toAddress(item.address)
        this.owner = toAddress(item.owner)
        return this.address
    }

    public async getVersion(): Promise<string> {
        const address = this.address
        const comandLine = `(call ${address} (version))`
        const result = await this.convex.query(comandLine, address)
        if (result && result['value']) {
            return result['value']
        }
    }
}
