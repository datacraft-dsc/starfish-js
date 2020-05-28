import assert from 'assert'
import fs from 'fs-extra'


import Account from '../src/Account'
import Web3 from 'web3'

let web3 = new Web3()
let password = web3.utils.randomHex(16)


describe('Account Class', () => {
    describe('Creation', () => {
        it('should create a new empty Account object', async () => {
            let account = new Account()
            assert(account)
        })
        it('should create a new Account object using a password', async () => {
            let account = Account.createNew(password)
            assert(account)
            assert.equal(account.getPassword(), password)
            assert(account.getAddress())
            assert(account.getKeyData())
            assert.equal(account.getKeyFilename(), null)
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

            let savedAccount = await Account.createFromFile(password, filename)
            assert(savedAccount)
            assert.equal(savedAccount.getAddress(), account.getAddress())
            fs.remove(filename)
        })
    })
    
    describe('common properties', () => {
        it('should return a checksum address', async () => {
            let account = Account.createNew(password)
            assert(account)
            assert(account.getChecksumAddress())
        })
    })

})
