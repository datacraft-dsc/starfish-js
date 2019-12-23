import DirectPurchase from "../../../../src/sg/dex/starfish/DirectPurchase";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";
import DirectProvider from "../../../../src/sg/dex/starfish/Providers/DirectProvider";
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"
import * as assert from "assert"

describe("DirectPurchase", () => {
    const tokenNumber = 10;
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
        const ocean = await Ocean.getInstance(config);
        const squidInstance = await ocean.getSquid();
        const accounts = await squidInstance.accounts.list();
        const receiver = accounts[1];
        const sender = accounts[0];

        let result = await squidInstance.accounts.requestTokens(sender, tokenNumber);
        assert(result);
        let balanceSenderBefore = await sender.getOceanBalance();
        let balanceReceiverBefore = await receiver.getOceanBalance();

        let txReceipt = await directPurchase.sendTokenAndLog(
            sender.getId(),
            receiver.getId(),
            tokenNumber,
            "1234",
            "1234"
            );
        assert(txReceipt.status);

        let balanceSenderAfter = await sender.getOceanBalance();
        let balanceReceiverAfter = await receiver.getOceanBalance();
        assert(balanceSenderAfter + tokenNumber === balanceSenderBefore);
        assert(balanceReceiverBefore + tokenNumber === balanceReceiverAfter);

        await directPurchase.shutdown();
    })
})