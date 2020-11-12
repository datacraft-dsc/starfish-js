import { ConvexAPI } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'

const CONTRACT_ACCOUNTS = {
    development: '0x1de659D38A129e2358CD3c4aF906Bc5eE48B33F27915539897F9fd66813e2beB',
}

export class ContractManager {
    readonly convex: ConvexAPI

    public constructor(convex: ConvexAPI) {
        this.convex = convex
    }
    public async load(name: string): Promise<ContractBase> {
        const contract = new ContractBase(this.convex, name)
        await contract.load(CONTRACT_ACCOUNTS.development)
        return contract
    }
}
