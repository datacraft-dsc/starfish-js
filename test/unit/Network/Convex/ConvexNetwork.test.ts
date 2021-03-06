import { assert } from 'chai'

import { ConvexAccount } from '@convex-dev/convex-api-js'
/*
 *
 *
 *
 */

import { ConvexNetwork, DDO, didCreate, didToId } from 'starfish'

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
        it('should request some test tokens to the test account', async () => {
            const requestAmount = Math.floor(Math.random() * 10) + 1
            const account = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
            const amount = await network.requestTestTokens(account, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
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
            const account = ConvexAccount.create()
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
            const toAccount = ConvexAccount.create()
            const amount = await network.sendToken(fromAccount, toAccount, transferAmount)
            assert(amount)
            assert.equal(amount, transferAmount)
            const balance = await network.getTokenBalance(toAccount)
            assert.equal(balance, transferAmount)

        })
    })
    describe('Register and resolve a ddo using a test did', () => {
        let network
        let account
        let ddo
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            account = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
            ddo = {
                'name': 'test_ddo'
            }
        })
        describe('registerDID', () => {
            it('should register a ddo string on the convex network', async () => {
                const did = didCreate()
                const result = await network.registerDID(account, did, JSON.stringify(ddo))
                assert.equal(result, didToId(did))
            })
        })
        describe('resolveDID', () => {
            it('should resolve a ddo string on the convex network', async () => {
                const did = didCreate()
                const result = await network.registerDID(account, did, JSON.stringify(ddo))
                assert.equal(result, didToId(did))
                const resolve_ddo = await network.resolveDID(did, account)
                assert.equal(JSON.stringify(ddo), resolve_ddo)
            })
        })
    })
    describe('Network helper methods', async () => {
        let network
        let account
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            account = await ConvexAccount.importFromFile(accountConfig.keyfile, accountConfig.password)
        })
        describe('resolveAgent', async () => {
            it('should find an agent using a DID', async () => {
                const ddo = DDO.createForAllServices('http://localhost')
                assert(await network.registerDID(account, ddo.getDID(), ddo.toString()))

                const resolvedDDO = await network.resolveAgent(ddo.getDID())
                assert(resolvedDDO)
            })
            it('should find an agent using a URL', async () => {
                const agentConfig = setup.agents['local']
                const ddo = await network.resolveAgent(agentConfig['url'], agentConfig['username'], agentConfig['password'])
                assert(ddo)
            })
        })
    })
})
