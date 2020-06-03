import { randomHex } from 'web3-utils'

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
            const account = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const balance = await network.getEtherBalance(account)
            assert(balance)
        })

        it("should get a token balance", async () => {
            let balance = await network.getTokenBalance(accountConfig.address)
            assert(balance)
        })


        it("should request some test tokens from a node account", async () => {
            const requestAmount = 10
            const account = await Account.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            assert(account, 'load account')
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
            const account = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const startBalance = await network.getTokenBalance(account.address)
            assert(startBalance)
            const isDone = await network.requestTestTokens(account, requestAmount)
            assert(isDone)
            const endBalance = await network.getTokenBalance(account.address)
            assert(endBalance, 'end balance')
            assert.equal(Number(startBalance) + requestAmount, endBalance, 'balance changed')
        })
    })
    describe("Send ether and tokens to another account", () => {
        before( async () => {
            network = await Starfish.getInstance(setup.network.url);
        })
        it("should send some ether from one account to another", async () => {
            const sendAmount = 10
            const fromAccount = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const toAccount = await Account.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            const fromBalance = await network.getEtherBalance(fromAccount)
            const toBalance = await network.getEtherBalance(toAccount)
            // console.log(fromBalance, toBalance)
            assert(await network.sendEther(fromAccount, toAccount, sendAmount))
            const sendFromBalance = await network.getEtherBalance(fromAccount)
            const sendToBalance = await network.getEtherBalance(toAccount)
            // console.log(sendFromBalance, sendToBalance)
            assert.equal(Number(fromBalance) - sendAmount, sendFromBalance)
            assert.equal(Number(toBalance) + sendAmount, sendToBalance)
        })

        it("should send some tokens from one account to another", async () => {
            const sendAmount = 10
            const fromAccount = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const toAccount = await Account.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            const fromBalance = await network.getTokenBalance(fromAccount)
            const toBalance = await network.getTokenBalance(toAccount)
            // console.log(fromBalance, toBalance)
            assert(await network.sendToken(fromAccount, toAccount, sendAmount))
            const sendFromBalance = await network.getTokenBalance(fromAccount)
            const sendToBalance = await network.getTokenBalance(toAccount)
            // console.log(sendFromBalance, sendToBalance)
            assert.equal(Number(fromBalance) - sendAmount, sendFromBalance)
            assert.equal(Number(toBalance) + sendAmount, sendToBalance)
        })
    })
    describe("Send ether and tokens to another account with logging", () => {
        before( async () => {
            network = await Starfish.getInstance(setup.network.url);
        })
        it("should send some token from one account to another with logging", async () => {
            const sendAmount = 1
            const fromAccount = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const toAccount = await Account.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            // get some tokens to send
            assert(await network.requestTestTokens(fromAccount, sendAmount * 2))

            // const fromBalance = await network.getTokenBalance(fromAccount)
            // const toBalance = await network.getTokenBalance(toAccount)
            const ref1 = 'my ref string'
            // console.log(fromBalance, toBalance)
            assert(await network.sendTokenWithLog(fromAccount, toAccount, sendAmount, ref1))
            assert(await network.isTokenSent(fromAccount, toAccount, sendAmount, ref1))
            const eventLogs = await network.getTokenEventLogs(fromAccount, toAccount, sendAmount, ref1)
            assert(eventLogs)
        })
    })
    describe("Register and get event logs for provenance", () => {
        before( async () => {
            network = await Starfish.getInstance(setup.network.url);
        })
        it("should register an asset id for provenance and then check the event logs", async () => {
            const account = await Account.loadFromFile(accountConfig.password, accountConfig.keyfile)
            const assetId = randomHex(32)
            assert(await network.provenanceRegister(account, assetId))

            const eventLogs = await network.getProvenanceEventLogs(assetId)
            assert(eventLogs)
            assert(eventLogs[0])
            assert.equal(eventLogs[0]['returnValues']['_assetID'], assetId)
            // console.log(eventLogs)
        })
    })
})
