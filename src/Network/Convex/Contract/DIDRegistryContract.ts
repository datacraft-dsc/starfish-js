import { Account as ConvexAccount, prefix0x } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'

import { IDDOResult } from './IDDOResult'

export class DIDRegistryContract extends ContractBase {
    public async register(account: ConvexAccount, did: string, ddoText: string): Promise<string> {
        const regexp = new RegExp(/"/, 'g')
        const encodedText = ddoText.replace(regexp, '\\"')
        const commandLine = `(register ${did} "${encodedText}")`
        const result: IDDOResult = await this.send(commandLine, account)
        return prefix0x(result.value)
    }

    public async resolve(did: string, addressAccount: ConvexAccount | BigInt | number | string): Promise<string> {
        const commandLine = `(resolve ${did})`
        const result: IDDOResult = await this.query(commandLine, addressAccount)
        return result.value
    }
}
