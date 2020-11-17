import { assert } from 'chai'

import fs from 'fs-extra'

import { EthereumNetwork } from 'starfish/Network/Ethereum/EthereumNetwork'
import { EthereumAccount } from 'starfish/Network/Ethereum/EthereumAccount'
import Web3 from 'web3'

import { loadTestSetup } from 'test/TestSetup'

let web3 = new Web3()
let password = web3.utils.randomHex(16)
let testAccount = EthereumAccount.createNew(password)

let setup = loadTestSetup()
const accountConfigNode = setup.ethereum.accounts['accountNode']


describe('EthereumAccount Class', () => {
    describe('Create class', () => {
        it('should create a new empty EthereumAccount object', async () => {
            let account = new EthereumAccount()
            assert(account)
        })
        it('should create a new EthereumAccount object using a password', async () => {
            let account = EthereumAccount.createNew(password)
            assert(account)
            assert.equal(account.password, password)
            assert(account.address)
            assert(account.keyData)
            assert.equal(account.keyFilename, null)
        })
    })

    describe('saveToFile', () => {
        it('should create a new empty EthereumAccount and save to file', async () => {
            let filename = '/tmp/testAccount_' + web3.utils.randomHex(16) + '.json'
            if (fs.pathExists(filename)) {
                fs.remove(filename)
            }
            let account = EthereumAccount.createNew(password)
            assert(account)
            await account.saveToFile(filename)
            assert(fs.pathExists(filename))
            fs.remove(filename)
        })
    })

    describe('loadFromFile', () => {
        it('should load back the account from a key data file', async () => {
            let filename = '/tmp/testAccount_' + web3.utils.randomHex(16) + '.json'
            if (fs.pathExists(filename)) {
                fs.remove(filename)
            }
            let account = EthereumAccount.createNew(password)
            assert(account)
            await account.saveToFile(filename)
            assert(fs.pathExists(filename))

            let savedAccount = await EthereumAccount.loadFromFile(password, filename)
            assert(savedAccount)
            assert.equal(savedAccount.address, account.address)
            fs.remove(filename)
        })
    })

    describe('loadFromNetwork', () => {
        it('should load an account from the network node', async () => {
            const network = await EthereumNetwork.getInstance(setup.ethereum.network.url);
            const account = await EthereumAccount.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            assert(account, 'load account')
        })
    })

    describe('checksumAddress', () => {
        it('should return a checksum address', async () => {
            assert(testAccount.checksumAddress)
        })
    })

    describe('isAddressEqual', () => {
        it('should match address when the address is all lower case', async () => {
            let address = testAccount.address.toLowerCase()
            assert(testAccount.isAddressEqual(address))
        })
    })

    describe('isPassword', () => {
        it('should be a valid password', async () => {
            assert(testAccount.isPassword())
        })
    })

})
