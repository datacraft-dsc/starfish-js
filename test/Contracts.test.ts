import assert from 'assert'

import { ContractManager } from '../src/Contract/ContractManager'
import { Network } from '../src/Network'


describe('Contracts', () => {
    describe('Contract Manger', () => {
        it('should create a new ContractManager object', async () => {
            const network = await Network.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.web3, network.networkName, 'artifacts')
            assert(manager)
        })
        it('should find an artifact file from a path list', async () => {
            const network = await Network.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.web3, network.networkName, 'artifacts')
            let pathFilename = manager.findArtifactFile(['artifacts', './'], 'DIDRegistry.spree.json')
            assert(pathFilename)
        })
        it('should load a contract', async () => {
            const network = await Network.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.web3, network.networkName, 'artifacts')
            let contract = manager.load('OceanToken')
            assert(contract)
        })

    })
})
