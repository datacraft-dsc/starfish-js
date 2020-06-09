/*
 *
 *     Test RemoteAgentAdapter Class
 *
 *
 */

import { assert } from 'chai'

import urljoin from 'url-join'

import { RemoteAgentAdapter } from '../src/Middleware/RemoteAgentAdapter'
import { loadTestSetup } from './TestSetup'


let setup = loadTestSetup()
const agentConfig = setup.agents['local']

var accessToken
var adapter

describe('RemoteAgentAdapter', () => {
    describe('getAuthorizationToken', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
        })
        it('should fetch a current or new token', async () => {
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            const token = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            assert(token)
        })
    })

    describe('getDDO', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
        })
        it('should fetch the agent ddo', async () => {
            const ddoText = await adapter.getDDO(agentConfig['url'], accessToken)
            assert(ddoText)
        })
    })
})
