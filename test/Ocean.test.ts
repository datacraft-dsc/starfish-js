import * as assert from "assert"
import Config from "../src/Config"
import Ocean from "../src/Ocean"

describe("Ocean", () => {

    describe("interface", () => {

        it("should expose Ocean", async () => {
            const config: Config = new Config();
            const ocean = Ocean.getInstance(config);
            assert(ocean);
        })
    })

})
