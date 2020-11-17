
import { ConvexAccount, ConvexAPI } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'
import { prefix0x } from '../../../Utils'

interface IDDOResult {
    value?: string
}

export class DIDRegistryContract extends ContractBase {
    constructor(convex: ConvexAPI) {
        super(convex, 'starfish-ddo-registry')
    }

    public async register(account: ConvexAccount, did: string, ddoText: string): Promise<string> {
        const regexp = new RegExp(/"/, 'g')
        const encodedText = ddoText.replace(regexp, '\\"')
        const commandLine = `(register ${did} "${encodedText}")`
        const result: IDDOResult = await this.send(commandLine, account)
        return prefix0x(result.value)
    }

    public async resolve(did: string, account: ConvexAccount | string): Promise<string> {
        const commandLine = `(resolve ${did})`
        const result: IDDOResult = await this.query(commandLine, account)
        return result.value
    }
}
