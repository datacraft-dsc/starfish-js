import { assert } from 'chai'

import { ConvexContractManager, ConvexNetwork } from 'starfish'


describe('Convex ContractManager Class', async () => {
    let network
    before( async () => {
        network = await ConvexNetwork.getInstance('https://convex.world');
    })
    describe('constructor', async () => {
        it('should create a new ContractManager object', async () => {
            const manager = new ConvexContractManager(network.convex)
            assert(manager)
        })
    })


})
