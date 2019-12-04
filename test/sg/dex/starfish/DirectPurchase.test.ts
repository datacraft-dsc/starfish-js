import DirectPurchase from "../../../../src/sg/dex/starfish/DirectPurchase";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";

describe("DirectPurchase", () => {
    it("init", ()  => {
        let mematamskProvider = new MetamaskProvider();
        let directPurchase = new DirectPurchase(mematamskProvider);
        directPurchase.initialize();
        directPurchase.stop();
    })
})