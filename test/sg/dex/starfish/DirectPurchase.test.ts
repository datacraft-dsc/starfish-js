import DirectPurchase from "../../../../src/sg/dex/starfish/DirectPurchase";
import MetamaskProvider from "../../../../src/sg/dex/starfish/Providers/MetamaskProvider";
import DirectProvider from "../../../../src/sg/dex/starfish/Providers/DirectProvider";
import Config from "../../../../src/Config"
import Ocean from "../../../../src/Ocean"
import * as assert from "assert"

describe("DirectPurchase", () => {
    const tokenNumber = 100000;
    const reference = "1234";
    xit("init Metamask provider", async ()  => {
        let mematamskProvider = new MetamaskProvider();
        let directPurchase = new DirectPurchase(mematamskProvider);
        const config = new Config();
        await directPurchase.sendTokenAndLog(
            config.values['test_account1'],
            tokenNumber,
            reference,
            reference,
            config.values['test_account2']
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

        // 1 is minimal to request according to the Ocean interface which is equal to 10^18.
        let result = await squidInstance.accounts.requestTokens(sender, 1);
        assert(result);
        let balanceSenderBefore = await squidInstance.keeper.token.balanceOf(sender.getId());
        let balanceReceiverBefore = await squidInstance.keeper.token.balanceOf(receiver.getId());

        let txReceipt = await directPurchase.sendTokenAndLog(
            receiver.getId(),
            tokenNumber,
            reference,
            reference,
            sender.getId()
            );
        assert(txReceipt.status);

        let balanceSenderAfter = await squidInstance.keeper.token.balanceOf(sender.getId());
        let balanceReceiverAfter = await squidInstance.keeper.token.balanceOf(receiver.getId());
        assert(balanceSenderAfter + tokenNumber === balanceSenderBefore);
        assert(balanceReceiverBefore + tokenNumber === balanceReceiverAfter);

        await directPurchase.shutdown();
    })
})