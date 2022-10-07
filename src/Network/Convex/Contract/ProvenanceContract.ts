import { Account as ConvexAccount, toAddress } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'
import { prefix0x, isAssetId } from '../../../Utils'
import { isAssetDID, isDID, didToId, didToAssetId } from '../../../DID'

import { IProvenanceData, IProvenanceDataList, IProvenanceOwnerList } from './IProvenance'

export class ProvenanceContract extends ContractBase {
    public async register(assetDID: string, data: string, account: ConvexAccount): Promise<IProvenanceData> {
        if ( !isAssetDID(assetDID)) {
            throw TypeError('invalid asset did')
        }
        const didId = prefix0x(didToId(assetDID))
        const assetId = prefix0x(didToAssetId(assetDID))
        const encodedText = ContractBase.escapeString(data)
        const commandLine = `(register ${didId} ${assetId} "${encodedText}")`
        const result = await this.send(commandLine, account)
        if (result['value']) {
            return {
                timestamp: result['value']['timestamp'],
                owner: toAddress(result['value']['owner']),
                data: result['value']['data']
            }
        }
        return null
    }

    public async getData(assetDID: string): Promise<IProvenanceData> {
        if ( !isAssetDID(assetDID)) {
            throw TypeError('invalid asset did')
        }
        const didId = prefix0x(didToId(assetDID))
        const assetId = prefix0x(didToAssetId(assetDID))
        const commandLine = `(get-data ${didId} ${assetId})`
        const result = await this.query(commandLine, this.address)
        if (result['value']) {
            return {
                timestamp: result['value']['timestamp'],
                owner: toAddress(result['value']['owner']),
                data: result['value']['data']
            }
        }
        return null
    }

    public async getDIDList(didId: string): Promise<IProvenanceDataList> {
        let didIdValue: string
        if ( isDID(didId)) {
            didIdValue = didToId(didId)
        }
        if (isAssetId(didId)) {
            didIdValue = didId
        }
        if (didIdValue === undefined) {
            throw TypeError('invalid didId')
        }
        const commandLine = `(did-id-list ${didIdValue})`
        const result = await this.query(commandLine, this.address)
        return result['value']
    }

    public async getOwnerList(addressAccount: ConvexAccount | BigInt | number | string): Promise<IProvenanceOwnerList> {
        const address = toAddress(addressAccount)
        const commandLine = `(owner-list ${address})`
        const result = await this.query(commandLine, this.address)
        if ( result['value'] ) {
            return result['value'].map(item => {
                return {
                    didId: item['did-id'],
                    assetId: item['asset-id']
                }
            })
        }
        return null
    }

}
