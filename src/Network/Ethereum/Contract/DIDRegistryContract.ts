import { TransactionReceipt } from 'web3-core'

import { ContractBase } from './ContractBase'
import { EthereumAccount } from '../EthereumAccount'

export class DIDRegistryContract extends ContractBase {
    constructor() {
        super('DIDRegistry')
    }

    public async register(account: EthereumAccount, did: string, ddoText: string): Promise<TransactionReceipt> {
        return this.sendToContract(this.contract.methods.registerDID(did, ddoText), account)
    }

    public async getBlockNumber(did: string): Promise<string> {
        return this.contract.methods.getBlockNumberUpdated(did).call()
    }
    public async getValue(did: string): Promise<string> {
        const blockNumber = await this.getBlockNumber(did)
        let value = null
        if (blockNumber) {
            const filter = {
                _did: did,
            }
            const eventLogs = await this.contract.getPastEvents('DIDRegistered', {
                filter: filter,
                fromBlock: blockNumber,
                toBlock: 'latest',
            })

            if (eventLogs && eventLogs.length > 0) {
                value = eventLogs[0]['returnValues']['_value']
            }
        }
        return value
    }
}
