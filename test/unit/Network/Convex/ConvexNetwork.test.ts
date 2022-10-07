import { assert } from 'chai'

import { KeyPair } from '@convex-dev/convex-api-js'
import { randomBytes } from 'crypto'


/*
 *
 *
 *
 */

import { ConvexNetwork, DDO, didCreate, didToId, didRandom, prefix0x } from 'starfish'

import { loadTestSetup } from 'test/TestSetup'

let setup = loadTestSetup()
const accountConfig = setup.convex.accounts['account1']

describe('ConvexNetwork Class', async () => {
    let testAccount
    before( async() => {
        const network = await ConvexNetwork.getInstance(setup.convex.network.url);
        const keyPair = await KeyPair.importFromFile(accountConfig.keyfile, accountConfig.password)
        testAccount = await network.convex.setupAccount(accountConfig['name'], keyPair)
    })
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
            const amount = await network.requestTestTokens(testAccount, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
        })
        it('should get the token balance from the account address', async () => {
            const balance = await network.getTokenBalance(testAccount.address)
            assert(balance)
        })
        it('should get the token balance from the an account object', async () => {
            const balance = await network.getTokenBalance(testAccount)
            assert(balance)
        })
    })
    describe('requestTestTokens', () => {
        let network
        let keyPair
        let requestAmount
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            keyPair = await KeyPair.importFromFile(accountConfig.keyfile, accountConfig.password)
            requestAmount = BigInt(Math.floor(Math.random() * 10) + 1)
        })
        it('should request some test tokens for a new account', async () => {
            const account = await network.convex.createAccount(keyPair)
            const amount = await network.requestTestTokens(account, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
        })
        it('should request some test tokens for the test account', async () => {
            const amount = await network.requestTestTokens(testAccount, requestAmount)
            assert(amount)
            assert.equal(amount, requestAmount)
        })
    })
    describe('Transfer tokens to another account', () => {
        let network
        let keyPair
        let transferAmount
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            keyPair = await KeyPair.importFromFile(accountConfig.keyfile, accountConfig.password)
            transferAmount = Math.floor(Math.random() * 100) + 1
        })
        it('should transfer some tokens from the test account to a new account', async () => {
            const toAccount = await network.convex.createAccount(keyPair)
            const amount = await network.sendToken(testAccount, toAccount, transferAmount)
            assert(amount)
            assert.equal(amount, transferAmount)
            const balance = await network.getTokenBalance(toAccount)
            assert.equal(balance, transferAmount)

        })
    })
    describe('Register and resolve a ddo using a test did', () => {
        let network
        let ddo
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
            ddo = {
                'name': 'test_ddo'
            }
        })
        describe('registerDID', () => {
            it('should register a ddo string on the convex network', async () => {
                const did = didCreate()
                const result = await network.registerDID(testAccount, did, JSON.stringify(ddo))
                assert.equal(result, didToId(did))
            })
        })
        describe('resolveDID', () => {
            it('should resolve a ddo string on the convex network', async () => {
                const did = didCreate()
                const result = await network.registerDID(testAccount, did, JSON.stringify(ddo))
                assert.equal(result, didToId(did))
                const resolve_ddo = await network.resolveDID(did, testAccount)
                assert.equal(JSON.stringify(ddo), resolve_ddo)
            })
        })
    })
    describe('Network helper methods', async () => {
        let network
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
        })
        describe('resolveAgent', async () => {
            it('should find an agent using a DID', async () => {
                const ddo = DDO.createForAllServices('http://localhost')
                assert(await network.registerDID(testAccount, ddo.getDID(), ddo.toString()))

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
    describe('Provenance Contract testing', async () => {
        let network
        before( async () => {
            network = await ConvexNetwork.getInstance(setup.convex.network.url);
        })
        describe('register and get a provenance record', async () => {
            const didId = didRandom()
            const data = randomBytes(1024).toString('hex')
            const assetId = randomBytes(32).toString('hex')
            const assetDID = `${didId}/${assetId}`
            it('should register a provenance record', async () => {
                const result = await network.registerProvenance(testAccount, assetDID, data)
                assert(result)
            })
            it('should return a valid provenance record', async () => {
                const result = await network.getProvenance(assetDID)
                assert(result)
                assert.equal(result.data, data)
            })
            it('should return the provenance record in the DID list', async () => {
                const result = await network.getProvenanceDIDList(didId)
                assert(result)
                assert(result[prefix0x(assetId)])
            })
            it('should return the provenance list of did, assetId for this owner', async () => {
                const result = await network.getProvenanceOwnerList(testAccount)
                assert(result)
            })


        })

    })
})
