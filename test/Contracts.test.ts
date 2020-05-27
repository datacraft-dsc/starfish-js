import assert from 'assert'

import ContractManager from '../src/Contracts/ContractManager'
import Starfish from '../src/Starfish'


describe('Contracts', () => {
    describe('Contract Manger', () => {
        it('should create a new ContractManager object', async () => {
            const network = await Starfish.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.getWeb3(), network.getNetworkName(), 'artifacts')
            assert(manager)
        })
        it('should find an artifact file from a path list', async () => {
            const network = await Starfish.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.getWeb3(), network.getNetworkName(), 'artifacts')
            let pathFilename = manager.findArtifactFile(['artifacts', './'], 'DIDRegistry.spree.json')
            assert(pathFilename)
        })
        it('should load a contract', async () => {
            const network = await Starfish.getInstance('http://localhost:8545');
            let manager = new ContractManager(network.getWeb3(), network.getNetworkName(), 'artifacts')
            let contract = manager.load('OceanToken')
            assert(contract)
        })

    })
})
