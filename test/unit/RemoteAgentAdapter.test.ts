/*
 *
 *     Test RemoteAgentAdapter Class
 *
 *
 */

import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)


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

const today = new Date(Date.now())
const listing = {
    'name': 'Test file asset',
    'description': 'Test asset for sale',
    'dateCreated': today.toISOString(),
    'author': 'starfish-js-test',
    'license': 'Closed',
    'price': 3.141592,              // price is in ocean tokens
    'extra_data': 'Some extra data',
    'tags': ['asset', 'sale', 'test', 'starfish'],
}



describe('RemoteAgentAdapter', () => {

    describe('Access to agent', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
        })
        describe('getAuthorizationToken', () => {
            it('should fetch a current or new token', async () => {
                const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
                const token = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
                assert(token)
            })
        })
    })

    describe('ddo based services', () => {
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

    describe('metadata based services', () => {
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
        describe('getMetadataList', () => {
            it('should read the metadata list on the agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const metadataList = await adapter.getMetadataList(metadataURL, accessToken)
                assert(metadataList)
                assert(metadataList[assetId])
            })
        })

    })
    describe('market place services', () => {
        var metadataURL
        var metadataText
        var marketURL
        var listingText
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)

            metadataText = JSON.stringify(metadata)
            metadataURL = `${agentConfig['url']}/api/v1/meta`

            listingText = JSON.stringify(listing)
            marketURL = `${agentConfig['url']}/api/v1/market`
        })
        describe('addListing', () => {
            it('should create and add a new listing', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
            })
        })
        describe('getListing', () => {
            it('should get a listing using a listing id', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
                const readListingData = await adapter.getListing(listingData['id'], marketURL, accessToken)
                assert(readListingData)
            })
        })

        describe('getListingList', () => {
            it('should get a list of listings, but does not work on the surfer agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
                assert.isRejected(adapter.getListingList(listingData['userid'], marketURL, accessToken),
                    /Unable to get a list of listing items/)
            })
        })

    })
})
