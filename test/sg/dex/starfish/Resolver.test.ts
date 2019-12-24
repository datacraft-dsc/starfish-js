import Resolver from "../../../../src/sg/dex/starfish/Resolver";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";
import DirectProvider from "../../../../src/sg/dex/starfish/Providers/DirectProvider";
import * as squid from "@oceanprotocol/squid"
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"
import * as assert from "assert"

describe("Resolver", () => {
    xit("init Metamask provider", async ()  => {
        let mematamskProvider = new MetamaskProvider();
        let resolver = new Resolver(mematamskProvider);
        await resolver.shutdown();
    })
    it("Test Resolver with DirectHttp provider", async ()  => {
        const config = new Config();
        const directProvider = new DirectProvider(config.values['keeper_url']);
        const ocean = await Ocean.getInstance(config);
        const squidInstance = await ocean.getSquid();
        const accounts = await squidInstance.accounts.list();
        const resolver = new Resolver(directProvider, accounts[0].getId());
        const did = squid.DID.generate();
        const reference = squid.DID.generate().getId();
        const receipt = await resolver.register(did.getId(),reference);
        assert(receipt.status);
        await resolver.shutdown();
    })
})