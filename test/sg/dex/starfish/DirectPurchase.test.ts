import DirectPurchase from "../../../../src/sg/dex/starfish/DirectPurchase";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";

describe("DirectPurchase", () => {
    it("init Metamask provider", async ()  => {
        let mematamskProvider = new MetamaskProvider();
        let directPurchase = new DirectPurchase(mematamskProvider);
        await directPurchase.sendTokenAndLog();
        await directPurchase.shutdown();
    })
})