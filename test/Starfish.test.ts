import assert from 'assert'

import Starfish from '../src/Starfish'
import Account from '../src/Account'
import DirectProvider from '../src/Providers/DirectProvider'
import { loadTestSetup } from './TestSetup'

var network


let setup = loadTestSetup()
const accountConfig = setup.accounts['account1']

describe("Starfish", () => {
    describe("basic object create", () => {
        it("should create a basic Starfish object using a url string", async () => {
            let network = await Starfish.getInstance(setup.network.url);
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })
        it("should create a basic Starfish object using a Provider object", async () => {
            let provider = new DirectProvider(setup.network.url)
            let network = await Starfish.getInstance(provider);
            assert(network, 'network');
            assert(network.getProvider(), 'provider')
            assert(network.getWeb3(), 'web3')
            assert(network.getArtifactsPath(), 'artifactsPath')
            assert(network.getNetworkId(), 'networkId')
            assert(network.getNetworkName(), 'networkName')
        })
    })
    describe("account operations", () => {
        before( async () => {
            network = await Starfish.getInstance(setup.network.url);
        })
        it("should get ether balance using an account address string", async () => {
            let balance = await network.getEtherBalance(setup.accounts['account1'].address)
            assert(balance)
        })
        it("should get ether balance using an account object", async () => {
            let account = new Account(accountConfig.address, accountConfig.password, accountConfig.keyfile)
            let balance = await network.getEtherBalance(account)
            assert(balance)
        })

        it("should get a token balance", async () => {
            let balance = await network.getTokenBalance(accountConfig.address)
            assert(balance)
        })
/*
        it("should request some test tokens", async () => {
            const requestAmount = 10
            let network = await Starfish.getInstance('http://localhost:8545');
            let startBalance = await network.getTokenBalance(testAddress)
            assert(startBalance)
            let result = await network.requestTestTokens(testAddress, requestAmount)
            let endBalance = await network.getTokenBalance(testAddress)
            assert(endBalance)
            console.log(startBalance, result, endBalance)

        })
*/
    })

})
