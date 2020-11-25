import { assert } from 'chai'

import { randomHex } from 'web3-utils'

import { EthereumAccount, EthereumNetwork, DDO, DirectProvider} from 'starfish'

import { loadTestSetup } from 'test/TestSetup'



let setup = loadTestSetup()
const accountConfig = setup.ethereum.accounts['account1']
const accountConfigNode = setup.ethereum.accounts['accountNode']

describe('EthereumNetwork Class', () => {
    describe('getInstance', () => {
        it('should create a basic Starfish object using a url string', async () => {
            let network = await EthereumNetwork.getInstance(setup.ethereum.network.url, { 'artifactsPath': 'artifactsPath' });
            assert(network, 'network');
            assert(network.provider, 'provider')
            assert(network.web3, 'web3')
            assert(network.networkId, 'networkId')
            assert(network.networkName, 'networkName')
            assert(network.options.artifactsPath, 'artifactsPath')
        })
        it('should create a basic Starfish object using a Provider object', async () => {
            let provider = new DirectProvider(setup.ethereum.network.url)
            let network = await EthereumNetwork.getInstance(provider);
            assert(network, 'network');
            assert(network.provider, 'provider')
            assert(network.web3, 'web3')
            assert(network.networkId, 'networkId')
            assert(network.networkName, 'networkName')
        })
    })

    describe('account operations', () => {
        let network
        before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
        })
        describe('getEtherBalance', () => {
            it('should get ether balance using an account address string', async () => {
                const balance = await network.getEtherBalance(accountConfig.address)
                assert(balance)
            })
            it('should get ether balance using an account object', async () => {
                const account = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                assert(account, 'load account')
                const balance = await network.getEtherBalance(account)
                assert(balance)
            })
        })

        describe('getTokenBalance', () => {
            it('should get a token balance', async () => {
                let balance = await network.getTokenBalance(accountConfig.address)
                assert(balance)
            })
        })

        describe('requestTestTokens', () => {
            it('should request some test tokens from a node account', async () => {
                const requestAmount = 1
                const account = await EthereumAccount.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
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
            it('should request some test tokens from a local account', async () => {
                const requestAmount = 1
                const account = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
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
    describe('Send ether and tokens to another account', () => {
        let network
        before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
        })
        describe('sendEther', () => {
            it('should send some ether from one account to another', async () => {
                const sendAmount = 1
                const fromAccount = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                const toAccount = await EthereumAccount.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
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
        })
        describe('sendToken', () => {
            it('should send some tokens from one account to another', async () => {
                const sendAmount = 1
                const fromAccount = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                const toAccount = await EthereumAccount.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
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
    })
    describe('Send ether and tokens to another account with logging', () => {
        let network
        before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
        })
        describe('requestTestTokens', () => {
            it('should send some token from one account to another with logging', async () => {
                const sendAmount = 1
                const fromAccount = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                const toAccount = await EthereumAccount.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
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
    })

    describe('Register and get event logs for provenance', () => {
        let network
        before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
        })
        describe('registerProvenance, getProvenanceEventLogs', () => {
            it('should register an asset id for provenance and then check the event logs', async () => {
                const account = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                const assetId = randomHex(32)
                assert(await network.registerProvenance(account, assetId))

                const eventLogs = await network.getProvenanceEventLogs(assetId)
                assert(eventLogs)
                assert(eventLogs[0])
                assert.equal(eventLogs[0]['returnValues']['_assetID'], assetId)
                // console.log(eventLogs)
            })
        })
    })

    describe('Register a did and get the stored ddo', () => {
        let network
        before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
        })
        describe('registerDID', () => {
            it('should register didId for a ddo and then find it in the network', async () => {
                const account = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
                const ddo = DDO.createForAllServices('http://localhost')
                assert(await network.registerDID(account, ddo.getDID(), ddo.toString()))

                const resolvedDDO = await network.resolveDID(ddo.getDID())
                // console.log(ddo, resolvedDDO)
                assert.equal(ddo, resolvedDDO)
            })
        })

        describe('resolveAgent', async () => {
            before( async () => {
            network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
            })
            it('should find an agent using a DID', async () => {
                const account = await EthereumAccount.loadFromFile(accountConfig.password, accountConfig.keyfile)
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
