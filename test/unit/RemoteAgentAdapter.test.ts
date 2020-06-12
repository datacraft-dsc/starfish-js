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
import { randomHex, hexToBytes } from 'web3-utils'

import { RemoteAgentAdapter } from 'starfish/Middleware/RemoteAgentAdapter'
import { loadTestSetup, enableSurferInvokableOperations } from 'test/TestSetup'
import { decodeToAssetId, removeLeadingHexZero } from 'starfish/Utils'
import { calcAssetDataHash } from 'starfish/Crypto'

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

const testInovkeName = 'Increment'

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
                const filter = {
                    userid: listingData['userid']
                }
                assert.isRejected(adapter.getListingList(filter, marketURL, accessToken),
                    /Unable to get a list of listing items/)
            })
        })
        describe('updateListing', () => {
            it('should update a listing at the surfer agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
                let newListingData = listingData
                newListingData['info']['name'] = 'new data'
                assert(await adapter.updateListing(listingData['id'], JSON.stringify(newListingData), marketURL, accessToken))
            })
        })
    })
    describe('market place services', () => {
        var metadataURL
        var metadataText
        var storageURL
        var assetId
        var assetData
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            assetData = Buffer.from(hexToBytes(randomHex(1024)))
            const metadataAsset = metadata
            const hash = calcAssetDataHash(assetData)
            metadataAsset['contentType'] = 'application/octet-stream'
            metadataAsset['contentHash'] = hash
            metadataText = JSON.stringify(metadataAsset)
            metadataURL = `${agentConfig['url']}/api/v1/meta`
            assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
            storageURL = `${agentConfig['url']}/api/v1/assets`
        })
        describe('uploadAssetData, downloadAssetData', () => {
            it('should upload asset data', async () => {
                assert(await adapter.uploadAssetData(assetId, assetData, storageURL, accessToken))
                const downloadData = await adapter.downloadAssetData(assetId, storageURL, accessToken)
                assert(downloadData)
                assert(downloadData.equals(assetData))
            })
        })
    })
    describe('invoke services', () => {
        var invokeURL
        var assetId
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const invokeList = await enableSurferInvokableOperations(agentConfig['url'], agentConfig['username'], agentConfig['password'])
            assert(invokeList['invokables'][testInovkeName])
            assetId = removeLeadingHexZero(decodeToAssetId(invokeList['invokables'][testInovkeName]))

            const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            invokeURL = `${agentConfig['url']}/api/v1/invoke`
        })
        describe('invoke sync', () => {
            it('should call a sync invoke service', async () => {
                const testNumber = Math.random() * 100
                const inputs = {
                    n: testNumber
                }
                const result = await adapter.invoke(assetId, JSON.stringify(inputs), true, invokeURL, accessToken)
                assert(result)
                assert(result['outputs'])
                assert.equal(result['status'], 'succeeded')
                const outputs = result['outputs']
                assert.equal(outputs['n'], testNumber  + 1)
            })
        })
        describe('invoke async, getJob', () => {
            it('should call an async invoke service, a get the job status', async () => {
                const testNumber = Math.random() * 100
                const inputs = {
                    n: testNumber
                }
                const result = await adapter.invoke(assetId, JSON.stringify(inputs), false, invokeURL, accessToken)
                assert(result)
                let jobResult
                while (true) {
                    jobResult = await adapter.getJob(result['job-id'], invokeURL, accessToken)
                    if (jobResult['status'] == 'succeeded') {
                        break
                    }
                }
                assert(jobResult['outputs'])
                const outputs = jobResult['outputs']
                assert.equal(outputs['n'], testNumber  + 1)
            })
        })
    })
})
