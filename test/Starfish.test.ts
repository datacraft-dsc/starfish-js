import assert from 'assert'

import Starfish from '../src/Starfish'
import DirectProvider from '../src/Providers/DirectProvider'

let testAddress = '0x00bd138abd70e2f00903268f3db08f2d25677c9e'

describe("Starfish", () => {
    describe("basic object create", () => {
        it("should create a basic Starfish object using a url string", async () => {
            let network = await Starfish.getInstance('http://localhost:8545');
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })
        it("should create a basic Starfish object using a Provider object", async () => {
            let provider = new DirectProvider('http://localhost:8545')
            let network = await Starfish.getInstance(provider);
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })
    })
    describe("account operations", () => {
        it("should get ether balance", async () => {
            let network = await Starfish.getInstance('http://localhost:8545');
            let balance = await network.getEtherBalance(testAddress)
            assert(balance)
        })

        it("should get a token balance", async () => {
            let network = await Starfish.getInstance('http://localhost:8545');
            let balance = await network.getTokenBalance(testAddress)
            assert(balance)
        })
    })

})
