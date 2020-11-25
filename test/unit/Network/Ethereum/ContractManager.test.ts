import { assert } from 'chai'

import { EthereumContractManager, EthereumNetwork } from 'starfish'

const artifactContractName = 'DexToken'
const artifactsPath = 'test/resources/network/ethereum/artifacts'

describe('Ethereum ContractManager Class', async () => {
    let network
    before( async () => {
        network = await EthereumNetwork.getInstance('http://localhost:8545');
    })
    describe('constructor', async () => {
        it('should create a new ContractManager object', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            assert(manager)
        })
    })
    describe('findArtifactFile', async () => {
        it('should find an artifact file from a path list', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            const pathFilename = manager.findArtifactFile([artifactsPath, './'], 'DIDRegistry.1337.json')
            assert(pathFilename)
        })
    })
    describe('load', async () => {
        it('should load a contract', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            const contract = manager.load('DexToken', artifactsPath)
            assert(contract)
        })
    })
    describe('loadArtifactFromFile', async () => {
        it('should return a single artifact from a file', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            const artifact = await manager.loadArtifactFromFile(artifactContractName, artifactsPath)
            assert(artifact)
        })
    })
    describe('loadArtifactFromPackage', async () => {
        it('should return a single artifact from the package', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            await manager.loadLocalArtifactsPackage()
            assert(manager.artifactsPackage)
            const artifact = manager.loadArtifactFromPackage(artifactContractName)
            assert(artifact)
        })
    })
    describe('loadLocalArtifactsPackage', async () => {
        it('should load a contract from the package', async () => {
            const manager = new EthereumContractManager(network.web3, network.networkId, network.networkName)
            await manager.loadLocalArtifactsPackage()
            assert(manager.artifactsPackage)
            const contract = manager.load('DexToken')
            assert(contract)
        })
    })

})
