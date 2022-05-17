import { Account as ConvexAccount, toAddress } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'
import { prefix0x } from '../../../Utils'

import { IProvenanceRegisterResult } from './IProvenanceRegisterResult'

export class ProvenanceContract extends ContractBase {
    public async register(assetId: string, data: string, account: ConvexAccount): Promise<IProvenanceRegisterResult> {
        const encodedText = ContractBase.escapeString(data)
        const commandLine = `(register ${prefix0x(assetId)} "${encodedText}")`
        const result = await this.send(commandLine, account)
        if (result['value']) {
            return {
                timestamp: result['value']['timestamp'],
                owner: toAddress(result['value']['owner']),
            }
        }
        return null
    }
}
