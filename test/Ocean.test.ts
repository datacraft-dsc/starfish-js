import * as assert from 'assert'
import Ocean from '../src/ocean'
import Config from '../src/Config'

describe("Ocean", () => {

    describe("interface", () => {

        it("should expose Ocean", async () => {
            const config: Config = new Config()
            const ocean = Ocean.getInstance(config)
            assert(ocean)
        })
    })

})
