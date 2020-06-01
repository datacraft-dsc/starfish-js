import assert from 'assert'

import Starfish from '../src/Starfish'
import Account from '../src/Account'
import DirectProvider from '../src/Providers/DirectProvider'
import { loadTestSetup } from './TestSetup'

var network


let setup = loadTestSetup()
const accountConfig = setup.accounts['account1']
const accountConfigNode = setup.accounts['accountNode']

describe("Starfish", () => {
    describe("basic object create", () => {
        it("should create a basic Starfish object using a url string", async () => {
            let network = await Starfish.getInstance(setup.network.url);
            assert(network, 'network');
            assert(network.provider, 'provider')
            assert(network.web3, 'web3')
            assert(network.artifactsPath, 'artifactsPath')
            assert(network.networkId, 'networkId')
            assert(network.networkName, 'networkName')
        })
        it("should create a basic Starfish object using a Provider object", async () => {
            let provider = new DirectProvider(setup.network.url)
            let network = await Starfish.getInstance(provider);
            assert(network, 'network');
            assert(network.provider, 'provider')
            assert(network.web3, 'web3')
            assert(network.artifactsPath, 'artifactsPath')
            assert(network.networkId, 'networkId')
            assert(network.networkName, 'networkName')
        })
    })
    describe("account operations", () => {
        before( async () => {
            network = await Starfish.getInstance(setup.network.url);
        })

        it("should get ether balance using an account address string", async () => {
            const balance = await network.getEtherBalance(accountConfig.address)
            assert(balance)
        })

        it("should get ether balance using an account object", async () => {
            const account = await Account.createFromFile(accountConfig.password, accountConfig.keyfile)
            const balance = await network.getEtherBalance(account)
            assert(balance)
        })

        it("should get a token balance", async () => {
            let balance = await network.getTokenBalance(accountConfig.address)
            assert(balance)
        })


        it("should request some test tokens from a node account", async () => {
            const requestAmount = 10
            const account = new Account(accountConfigNode.address, accountConfigNode.password)
            const startBalance = await network.getTokenBalance(account.address)
            assert(startBalance)
            assert(await account.unlock(network.web3), 'unlock account')
            const isDone = await network.requestTestTokens(account, requestAmount)
            assert(isDone)
            const endBalance = await network.getTokenBalance(account.address)
            assert(endBalance, 'end balance')
            assert.equal(Number(startBalance) + requestAmount, endBalance, 'balance changed')
        })

        it("should request some test tokens from a local account", async () => {
            const requestAmount = 10
            const account = await Account.createFromFile(accountConfig.password, accountConfig.keyfile)
            const startBalance = await network.getTokenBalance(account.address)
            assert(startBalance)
            const isDone = await network.requestTestTokens(account, requestAmount)
            assert(isDone)
            const endBalance = await network.getTokenBalance(account.address)
            assert(endBalance, 'end balance')
            assert.equal(Number(startBalance) + requestAmount, endBalance, 'balance changed')
        })


    })

})
