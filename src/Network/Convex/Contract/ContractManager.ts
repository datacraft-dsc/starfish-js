import { ConvexAPI } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'

const CONTRACT_ACCOUNTS = {
    development: '0x1de659D38A129e2358CD3c4aF906Bc5eE48B33F27915539897F9fd66813e2beB',
}

export class ContractManager {
    private static contracts
    readonly convex: ConvexAPI

    public constructor(convex: ConvexAPI) {
        this.convex = convex
        ContractManager.contracts = {}
    }
    public async load(name: string): Promise<ContractBase> {
        if ( !ContractManager.contracts[name]) {
            const contractName = `./${name}Contract`
            const contractClass = await import(contractName)
            const constructorName = Object.keys(contractClass)[0]
            ContractManager.contracts[name] = new contractClass[constructorName](this.convex)
            await ContractManager.contracts[name].load(CONTRACT_ACCOUNTS.development)
        }
        return ContractManager.contracts[name]
    }
}
