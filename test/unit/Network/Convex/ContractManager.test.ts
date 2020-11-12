import { assert } from 'chai'

import { ContractManager } from 'starfish/Network/Convex/Contract/ContractManager'
import { ConvexNetwork } from 'starfish/Network/Convex/ConvexNetwork'


describe('Convex ContractManager Class', async () => {
    let network
    before( async () => {
        network = await ConvexNetwork.getInstance('https://convex.world');
    })
    describe('constructor', async () => {
        it('should create a new ContractManager object', async () => {
            const manager = new ContractManager(network.convex)
            assert(manager)
        })
    })


})
