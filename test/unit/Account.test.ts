import { assert } from 'chai'

import fs from 'fs-extra'

import { Network } from 'starfish/Network'
import { Account } from 'starfish/Account'
import Web3 from 'web3'

import { loadTestSetup } from 'test/TestSetup'

let web3 = new Web3()
let password = web3.utils.randomHex(16)
let testAccount = Account.createNew(password)

let setup = loadTestSetup()
const accountConfigNode = setup.accounts['accountNode']


describe('Account Class', () => {
    describe('Creation', () => {
        it('should create a new empty Account object', async () => {
            let account = new Account()
            assert(account)
        })
        it('should create a new Account object using a password', async () => {
            let account = Account.createNew(password)
            assert(account)
            assert.equal(account.password, password)
            assert(account.address)
            assert(account.keyData)
            assert.equal(account.keyFilename, null)
        })
    })
    describe('saveToFile', () => {
        it('should create a new empty Account and save to file', async () => {
            let filename = '/tmp/testAccount_' + web3.utils.randomHex(16) + '.json'
            if (fs.pathExists(filename)) {
                fs.remove(filename)
            }
            let account = Account.createNew(password)
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
            let account = Account.createNew(password)
            assert(account)
            await account.saveToFile(filename)
            assert(fs.pathExists(filename))

            let savedAccount = await Account.loadFromFile(password, filename)
            assert(savedAccount)
            assert.equal(savedAccount.address, account.address)
            fs.remove(filename)
        })
    })


    describe('loadFromNetwork', () => {
        it('should load an account from the network node', async () => {
            const network = await Network.getInstance(setup.network.url);
            const account = await Account.loadFromNetwork(network, accountConfigNode.address, accountConfigNode.password)
            assert(account, 'load account')
        })
    })

    describe('common properties', () => {
        it('should return a checksum address', async () => {
            assert(testAccount.checksumAddress)
        })
        it('should match address when the address is all lower case', async () => {
            let address = testAccount.address.toLowerCase()
            assert(testAccount.isAddressEqual(address))
        })
        it('should be a valid password', async () => {
            assert(testAccount.isPassword())
        })

    })

})
