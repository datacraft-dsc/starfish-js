/*
 *
 *     Test RemoteAgentAdapter Class
 *
 *
 */

import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)


import { randomBytes } from 'crypto'
import { urlJoin } from 'url-join-ts'

import { loadTestSetup, enableSurferInvokableOperations } from 'test/TestSetup'
import { calculateAssetDataHash, didToAssetId, remove0xPrefix, RemoteAgentAdapter } from 'starfish'

let setup = loadTestSetup()
const agentConfig = setup.agents['local']

var accessToken
var adapter

const metaData = {
    "name": "testmetadata",
    "description": "test metadata from starfish-js test",
    "type": "dataset",
    "contentType": "text/plain",
    "contentHash": `${randomBytes(32).toString('hex')}`,
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
                const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
                const token = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
                assert(token)
            })
        })
    })

    describe('ddo based services', () => {
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
        })
        describe('getDDO', () => {
            it('should fetch the agent ddo', async () => {
                const ddoText = await adapter.getDDO(agentConfig['url'], accessToken)
                assert(ddoText)
            })
        })
    })

    describe('metaData based services', () => {
        var metadataURL
        var metadataText
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            metadataText = JSON.stringify(metaData)
            metadataURL = `${agentConfig['url']}/api/v1/meta`
        })
        describe('saveMetadata', () =>  {
            it('should save metaData to a remote agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                assert(assetId)
            })
        })
        describe('readMetadata', () => {
            it('should read a saved metaData item', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const readMetadata = await adapter.readMetadata(assetId, metadataURL, accessToken)
                assert(readMetadata)
                assert.equal(readMetadata, metadataText)
            })
        })
        describe('getMetadataList', () => {
            it('should read the metaData list on the agent', async () => {
                const assetId = await adapter.saveMetadata(metadataText, metadataURL, accessToken)
                const metadataList = await adapter.getMetaDataList(metadataURL, accessToken)
                assert(metadataList)
                assert(metadataList[assetId])
            })
        })

    })
    describe('market place services', () => {
        var metaDataURL
        var metaDataText
        var marketURL
        var listingText
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)

            metaDataText = JSON.stringify(metaData)
            metaDataURL = `${agentConfig['url']}/api/v1/meta`

            listingText = JSON.stringify(listing)
            marketURL = `${agentConfig['url']}/api/v1/market`
        })
        describe('addListing', () => {
            it('should create and add a new listing', async () => {
                const assetId = await adapter.saveMetadata(metaDataText, metaDataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
            })
        })
        describe('getListing', () => {
            it('should get a listing using a listing id', async () => {
                const assetId = await adapter.saveMetadata(metaDataText, metaDataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
                const readListingData = await adapter.getListing(listingData['id'], marketURL, accessToken)
                assert(readListingData)
            })
        })

        describe('getListingList', () => {
            it('should get a list of listings, but does not work on the surfer agent', async () => {
                const assetId = await adapter.saveMetadata(metaDataText, metaDataURL, accessToken)
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
                const assetId = await adapter.saveMetadata(metaDataText, metaDataURL, accessToken)
                const listingData = await adapter.addListing(listingText, assetId, marketURL, accessToken)
                assert(listingData)
                let newListingData = listingData
                newListingData['info']['name'] = 'new data'
                const updateListingData = await adapter.updateListing(newListingData, marketURL, accessToken)
                assert(updateListingData)
            })
        })
    })
    describe('market place services', () => {
        var metaDataURL
        var metaDataText
        var storageURL
        var assetId
        var assetData
        before(async () => {
            adapter = RemoteAgentAdapter.getInstance()
            const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            assetData = Buffer.from(randomBytes(1024))
            const metaDataAsset = metaData
            const hash = calculateAssetDataHash(assetData)
            metaDataAsset['contentType'] = 'application/octet-stream'
            metaDataAsset['contentHash'] = hash
            metaDataText = JSON.stringify(metaDataAsset)
            metaDataURL = `${agentConfig['url']}/api/v1/meta`
            assetId = await adapter.saveMetadata(metaDataText, metaDataURL, accessToken)
            storageURL = `${agentConfig['url']}/api/v1/assets`
        })
        describe('uploadAssetData, downloadAssetData', () => {
            it('should upload asset data', async () => {
                assert(await adapter.uploadAssetData(assetId, assetData, storageURL, accessToken))
                const downloadData = await adapter.downloadAssetData(assetId, storageURL, accessToken)
                assert(downloadData)
                assert(Buffer.from(downloadData).equals(assetData))
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
            assetId = remove0xPrefix(didToAssetId(invokeList['invokables'][testInovkeName]))

            const tokenURL = urlJoin(agentConfig['url'], '/api/v1/auth/token')
            accessToken = await adapter.getAuthorizationToken(agentConfig['username'], agentConfig['password'], tokenURL)
            invokeURL = `${agentConfig['url']}/api/v1/invoke`
        })
        describe('invoke sync', () => {
            it('should call a sync invoke service', async () => {
                const testNumber = Math.random() * 100
                const inputs = {
                    n: testNumber
                }
                const result = await adapter.invoke(assetId, JSON.stringify(inputs), false, invokeURL, accessToken)
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
                const result = await adapter.invoke(assetId, JSON.stringify(inputs), true, invokeURL, accessToken)
                assert(result)
                let jobResult
                while (true) {
                    jobResult = await adapter.getJob(result['jobId'], invokeURL, accessToken)
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
