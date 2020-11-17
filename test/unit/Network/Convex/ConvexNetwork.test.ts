import { assert } from 'chai'

import { ConvexAccount } from '@convex-dev/convex-api-js'
import { ConvexNetwork } from 'starfish/Network/Convex/ConvexNetwork'

import { loadTestSetup } from 'test/TestSetup'

let setup = loadTestSetup()
const accountConfig = setup.convex.accounts['account1']

describe('ConvexNetwork Class', async () => {
    describe('getInstance', async () => {
        it('should create a basic Starfish object using a url string', async () => {
            let network = await ConvexNetwork.getInstance(setup.convex.network.url);
            assert(network, 'network');
            assert(network.convex, 'convex')
        })
    })
    describe('getTokenBalance', async () => {
        let network
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
        })
        it('should get the token balance from the account address', async () => {
            const balance = await network.getTokenBalance(accountConfig.address)
            assert(balance)
        })
        it('should get the token balance from the an account object', async () => {
            const account = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
            const balance = await network.getTokenBalance(account)
            assert(balance)
        })
    })
    describe('requestTestTokens', () => {
        let network
        let requestAmount
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            requestAmount = Math.floor(Math.random() * 10) + 1
        })
        it('should request some test tokens for a new account', async () => {
            const account = ConvexAccount.createNew()
            const amount = await network.requestTestTokens(account, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
        })

        it('should request some test tokens for the test account', async () => {
            const account = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
            const amount = await network.requestTestTokens(account, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
        })
    })
    describe('Transfer tokens to another account', () => {
        let network
        let transferAmount
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            transferAmount = Math.floor(Math.random() * 100) + 1
        })
        it('should transfer some tokens from the test account to a new account', async () => {
            const fromAccount = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
            const toAccount = ConvexAccount.createNew()
            const amount = await network.sendToken(fromAccount, toAccount, transferAmount)
            assert(amount)
            assert.equal(amount, transferAmount)
            const balance = await network.getTokenBalance(toAccount)
            assert.equal(balance, transferAmount)

        })
    })

})
