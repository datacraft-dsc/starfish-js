import { TransactionReceipt } from 'web3-core'
import { EventData } from 'web3-eth-contract'

import { ContractBase } from './ContractBase'
import { Account } from 'starfish/Account'

export class ProvenanceContract extends ContractBase {
    constructor() {
        super('Provenance')
    }

    public async register(account: Account, assetId: string): Promise<TransactionReceipt> {
        return this.sendToContract(this.contract.methods.registerAsset(assetId), account)
    }

    public async getEventLogs(assetId: string): Promise<EventData[]> {
        const filter = {
            _assetID: assetId,
        }
        return this.contract.getPastEvents('AssetRegistered', {
            filter: filter,
            fromBlock: 0,
            toBlock: 'latest',
        })
    }
}
