/*
 *
 *     Test RemoteAgentAdapter Class
 *
 *
 */

import { assert } from 'chai'

import urljoin from 'url-join'

import { RemoteAgentAdapter } from 'starfish/Middleware/RemoteAgentAdapter'
import { loadTestSetup } from 'test/TestSetup'


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

    describe('ddo based operations', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
        })
        describe('getDDO', () => {
            it('should fetch the agent ddo', async () => {
                const ddoText = await adapter.getDDO(agentConfig['url'], accessToken)
                assert(ddoText)
            })
        })
    })

    describe('metadata based operations', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
        })
        describe('saveMetadata', () =>  {
            it('save metadata to a remote agent', async () => {
                const url = `${agentConfig['url']}/api/v1/meta`
                const metadata = {
                    "name": "testmetadata",
                    "description": "test metadata from starfish-js test",
                    "type": "dataset",
                    "contentType": "text/plain",
                    "contentHash": "0x0000000000000000000000000000000",
                }
                const metadataText = JSON.stringify(metadata)
                const assetId = await adapter.saveMetadata(metadataText, url, accessToken)
                assert(assetId)
            })
        })

    })
})
