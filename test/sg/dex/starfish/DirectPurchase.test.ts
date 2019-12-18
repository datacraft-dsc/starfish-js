import DirectPurchase from "../../../../src/sg/dex/starfish/DirectPurchase";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";
import DirectProvider from "../../../../src/sg/dex/starfish/Providers/DirectProvider";
import Config from "../../../../src/Config"

describe("DirectPurchase", () => {
    xit("init Metamask provider", async ()  => {
        let mematamskProvider = new MetamaskProvider();
        let directPurchase = new DirectPurchase(mematamskProvider);
        const config = new Config();
        await directPurchase.sendTokenAndLog(
            config.values['test_account2'], 
            config.values['test_account1'],
            10,
            "1234",
            "1234"
            );
        await directPurchase.shutdown();
    })

    it("Test DirectPurchase with DirectHttp provider", async ()  => {
        const config = new Config();
        let directProvider = new DirectProvider(config.values['keeper_url']);
        let directPurchase = new DirectPurchase(directProvider);
        await directPurchase.sendTokenAndLog(
            config.values['test_account2'],
            config.values['test_account1'],
            10,
            "1234",
            "1234"
            );
        await directPurchase.shutdown();
    })
})