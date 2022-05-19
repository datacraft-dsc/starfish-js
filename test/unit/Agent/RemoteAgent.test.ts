/*
 *
 *     Test RemoteAgent Class
 *
 *
 */

import { assert } from 'chai'
import { randomBytes } from 'crypto'


import { loadTestSetup, enableSurferInvokableOperations } from 'test/TestSetup'
import { AgentManager, DataAsset, extractAssetId, OperationAsset, RemoteAgent, remove0xPrefix } from 'starfish'

let setup = loadTestSetup()
const agentConfig = setup.agents['local']
const agentAuthentication = {
    username: agentConfig['username'],
    password: agentConfig['password'],
}

const testInovkeName = 'Increment'

describe('RemoteAgent Class', () => {
    describe('resolveURL', () => {
        it('should fetch a ddo from the agent url', async () => {
            const ddoText = await RemoteAgent.resolveURL(agentConfig['url'], agentAuthentication)
            assert(ddoText)
            const agent = new RemoteAgent(ddoText, agentAuthentication)
            assert(agent)
        })
    })

    describe('RemoteAgent methods', () => {
        let agent
        before( async () => {
            const ddoText = await RemoteAgent.resolveURL(agentConfig['url'], agentAuthentication)
            assert(ddoText)
            agent = new RemoteAgent(ddoText, agentAuthentication)
            assert(agent)
        })
        describe('registerAsset', () => {
            it('should register a data asset', async () => {
                const data = Buffer.from(randomBytes(1024))
                const asset = DataAsset.create('testAsset', data)
                const registerAsset = await agent.registerAsset(asset)
                assert(registerAsset)
                assert(registerAsset.did)
            })
        })
        describe('Test on a registered asset', () => {
            let data
            let registerAsset
            before( async () => {
                data = Buffer.from(randomBytes(1024))
                const asset = DataAsset.create('testAsset', data)
                registerAsset = await agent.registerAsset(asset)
            })

            describe('getAsset', () => {
                it('should read asset from the remote agent', async () => {
                    const readAsset = await agent.getAsset(registerAsset.did)
                    assert(readAsset)
                    assert(readAsset.did)
                    assert.equal(readAsset.metadataText, registerAsset.metadataText)
                })
            })
            describe('uploadAsset', () => {
                it('should upload asset data to remote agent', async () => {
                    assert(await agent.uploadAsset(registerAsset))
                })
            })
            describe('downloadAsset', () => {
                it('should download asset data from a remote agent', async () => {
                    assert(await agent.uploadAsset(registerAsset))
                    const newAsset = await agent.downloadAsset(registerAsset.did)
                    assert(newAsset)
                    assert(newAsset.data.equals(data))
                })
            })
        })
        describe('Test Market API', () => {
            let data
            let registerAsset
            const listing = {
                price: 100,
                description: 'test listing',
            }
            before( async () => {
                data = Buffer.from(randomBytes(1024))
                const asset = DataAsset.create('testAsset', data)
                registerAsset = await agent.registerAsset(asset)
            })

            describe('createListing', () => {
                it('should create a new listing', async () => {
                    const listingSaved = await agent.createListing(listing, registerAsset.did)
                    assert(listingSaved)
                    assert(listingSaved.assetid)
                    assert(listingSaved.userid)
                })
            })
            describe('updateListing', () => {
                it('should update a current listing', async () => {
                    const listingSaved = await agent.createListing(listing, registerAsset.did)
                    assert(listingSaved)
                    assert.equal(listingSaved.status, 'unpublished')
                    listingSaved.status = 'published'
                    const listingUpdated = await agent.updateListing(listingSaved)
                    assert.equal(listingUpdated.status, 'published')
                })
            })
            describe('getListing', () => {
                it('should get a listing using the listing id', async () => {
                    const listingSaved = await agent.createListing(listing, registerAsset.did)
                    assert(listingSaved)
                    const listingRead = await agent.getListing(listingSaved.id)
                    assert.equal(listingSaved.id, listingRead.id)
                })
            })
            describe('getListingList', () => {
                // not supported on Surfer - bug shows an error
            })

        })
        describe('Test on an invokable asset', () => {
            let invokeAsset: OperationAsset
            let assetId: string
            let testNumber: number
            let inputs
            before( async () => {
                const invokeList = await enableSurferInvokableOperations(agentConfig['url'], agentConfig['username'], agentConfig['password'])
                assert(invokeList['invokables'][testInovkeName])
                assetId = remove0xPrefix(extractAssetId(invokeList['invokables'][testInovkeName]))
                invokeAsset = await agent.getAsset(assetId)
                testNumber = Math.random() * 100
                inputs = {
                    n: testNumber
                }
            })
            describe('invoke', () => {
                it('should invoke a sync operation', async () => {
                    const result = await agent.invoke(invokeAsset, inputs)
                    assert(result)
                    assert(result['outputs'])
                    assert.equal(result['status'], 'succeeded')
                    const outputs = result['outputs']
                    assert.equal(outputs['n'], testNumber  + 1)
                })
                it('should invoke an async operation', async () => {
                    const result = await agent.invoke(invokeAsset, inputs, true)
                    assert(result)
                    assert(result['jobId'])
                })
            })
            describe('getJob', () => {
                it('should request job status on an sync operation, using the jobId', async () => {
                    const result = await agent.invoke(invokeAsset, inputs, true)
                    assert(result)
                    assert(result['jobId'])
                    const jobStatus = await agent.getJob(result['jobId'])
                    assert(jobStatus)
                    assert.equal(jobStatus['id'], result['jobId'])
                })
                it('should request job status on an sync operation, using the IInvokeResult record', async () => {
                    const result = await agent.invoke(invokeAsset, inputs, true)
                    assert(result)
                    assert(result['jobId'])
                    const jobStatus = await agent.getJob(result)
                    assert(jobStatus)
                    assert.equal(jobStatus['id'], result['jobId'])
                })
            })
        })
        describe('Test convinence methods and procedures to invoke an agent opreation', () => {
            let agent
            let testOperationName
            before( async () => {
                testOperationName = 'Tokenize Text'
                const invokeList = await enableSurferInvokableOperations(agentConfig['url'], agentConfig['username'], agentConfig['password'])
                assert(invokeList)
                assert(invokeList['invokables'][testOperationName])
                const agentManager = AgentManager.getInstance()
                const authentication = {
                    username: agentConfig['username'],
                    password: agentConfig['password'],
                }
                agent = await agentManager.loadAgent(agentConfig['url'], authentication)
                assert(agent)
            })
            it('should find the invokable asset from the metadata on the agent', async () => {
                const filter = {
                    name: testOperationName,
                    type: 'operation'
                }
                const metaDataList = await agent.findAsset(filter)
                assert(metaDataList)
                for (let assetId in metaDataList) {
                    const metaData = metaDataList[assetId]
                    assert(metaData.name === filter.name && metaData.type === filter.type)
                }

            })
            it('should call a single invoke method using the name of the invokable service', async () => {
                const inputs = {
                    text: 'test text to tokenize'
                }
                const result = await agent.invoke(testOperationName, inputs)
                assert(result)
                console.log(result)
                assert.equal(result.status, 'succeeded')
            })
        })
    })
})
