import assert from 'assert'

import Starfish from '../src/Starfish'
import DirectProvider from '../src/Providers/DirectProvider'

describe("Starfish", () => {
    describe("basic object create", () => {
        it("should create a basic Starfish object using a url string", async () => {
            const network =await Starfish.getInstance('http://localhost:8545');
            assert(network);
            assert(network.getNetworkId())
        })
        it("should create a basic Starfish object using a Provider object", async () => {
            let provider = new DirectProvider('http://localhost:8545')
            const network = await Starfish.getInstance(provider);
            assert(network);
            assert(network.getNetworkId())
        })

    })
})
