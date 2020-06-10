/*
 *
 *     Test RemoteAgentAdapter Class
 *
 *
 */

import { assert } from 'chai'

import urljoin from 'url-join'
import { randomHex } from 'web3-utils'

import { RemoteAgentAdapter } from 'starfish/Middleware/RemoteAgentAdapter'
import { loadTestSetup } from 'test/TestSetup'


let setup = loadTestSetup()
const agentConfig = setup.agents['local']

var accessToken
var adapter

const metadata = {
    "name": "testmetadata",
    "description": "test metadata from starfish-js test",
    "type": "dataset",
    "contentType": "text/plain",
    "contentHash": `${randomHex(32)}`,
}



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
        var metadataURL
        var metadataText
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            metadataText = JSON.stringify(metadata)
            metadataURL = `${agentConfig['url']}/api/v1/meta`
        })
        describe('saveMetadata', () =>  {
            it('should save metadata to a remote agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                assert(assetId)
            })
        })
        describe('readMetadata', () => {
            it('should read a saved metadata item', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const readMetadata = await adapter.readMetadata(assetId, metadataURL, accessToken)
                assert(readMetadata)
                assert.equal(readMetadata, metadataText)
            })
        })

    })
})
