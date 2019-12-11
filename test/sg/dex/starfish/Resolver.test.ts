import Resolver from "../../../../src/sg/dex/starfish/Resolver";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";

describe("Resolver", () => {
    xit("init Metamask provider", async ()  => {
        let mematamskProvider = new MetamaskProvider();
        let resolver = new Resolver(mematamskProvider);
        await resolver.shutdown();
    })
})