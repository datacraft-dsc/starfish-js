import assert from 'assert'

import DNetwork from '../src/DNetwork'


describe("DNetwork", () => {
    describe("interface", () => {
        it("should expose DNetwork", async () => {
            const network =await DNetwork.getInstance('http://localhost:8545');
            assert(network);
            console.log(network.getNetworkId())
        })
    })
})
