/*
 *
 *     Test RemoteAgent Class
 *
 *
 */

import { assert } from 'chai'


import { RemoteAgent } from '../src/Agent/RemoteAgent'
import { loadTestSetup } from './TestSetup'


let setup = loadTestSetup()
const agentConfig = setup.agents['local']

describe('RemoteAgent', () => {
    describe('resolveURL', () => {
        it('should fetch a ddo from the agent url', async () => {
            const agentAuthentication = {
                username: agentConfig['username'],
                password: agentConfig['password'],
            }
            const ddoText = await RemoteAgent.resolveURL(agentConfig['url'], agentAuthentication)
            assert(ddoText)
        })
    })
})
