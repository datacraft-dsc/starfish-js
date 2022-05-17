import { API as ConvexAPI } from '@convex-dev/convex-api-js'

import { ContractBase } from './ContractBase'

export class ConvexContractManager {
    private static contracts
    readonly convex: ConvexAPI

    public constructor(convex: ConvexAPI) {
        this.convex = convex
        ConvexContractManager.contracts = {}
    }
    public async load(name: string, registerName: string): Promise<ContractBase> {
        if (!ConvexContractManager.contracts[name]) {
            const contractName = `./${name}Contract`
            const contractClass = await import(contractName)
            const constructorName = Object.keys(contractClass)[0]
            ConvexContractManager.contracts[name] = new contractClass[constructorName](this.convex)
            await ConvexContractManager.contracts[name].resolveAddress(registerName)
        }
        return ConvexContractManager.contracts[name]
    }
}
