import assert from 'assert'

import Account from '../src/Account'


describe('Account', () => {
    describe('Account Class', () => {
        it('should create a new Account object', async () => {
            const account = new Account()
            assert(account)
        })

    })
})
