import assert from 'assert'

import Starfish from '../src/Starfish'
import DirectProvider from '../src/Providers/DirectProvider'

describe("Starfish", () => {
    describe("basic object create", () => {
        it("should create a basic Starfish object using a url string", async () => {
            const network = await Starfish.getInstance('http://localhost:8545');
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })
        it("should create a basic Starfish object using a Provider object", async () => {
            let provider = new DirectProvider('http://localhost:8545')
            const network = await Starfish.getInstance(provider);
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })

    })
})
