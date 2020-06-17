/*
 *
 *     Test RemoteAgent Class
 *
 *
 */

import { assert } from 'chai'
import { randomHex, hexToBytes } from 'web3-utils'


import { RemoteAgent } from 'starfish/Agent/RemoteAgent'
import { loadTestSetup, enableSurferInvokableOperations } from 'test/TestSetup'
import { DataAsset, OperationAsset } from 'starfish/Asset'
import { Network } from 'starfish/Network'
import { extractAssetId, removeLeadingHexZero } from 'starfish/Utils'


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
        })
    })
    describe('createFromAddress', () => {
        let network
        before( () => {
            network = Network.getInstance(setup.network.url);
        })
        it('should create new RemoteAgent from a URL', async () => {
            const agent = RemoteAgent.createFromAddress(agentConfig['url'], network, agentAuthentication)
            assert(agent)
        })
    })

    describe('RemoteAgent methods', () => {
        let network
        let agent
        before( async () => {
            network = Network.getInstance(setup.network.url);
            agent = await RemoteAgent.createFromAddress(agentConfig['url'], network, agentAuthentication)
        })
        describe('registerAsset', () => {
            it('should register a data asset', async () => {
                const data = Buffer.from(hexToBytes(randomHex(1024)))
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
                data = Buffer.from(hexToBytes(randomHex(1024)))
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
        describe('Test on an invokable asset', () => {
            let invokeAsset: OperationAsset
            let assetId: string
            before( async () => {
                const invokeList = await enableSurferInvokableOperations(agentConfig['url'], agentConfig['username'], agentConfig['password'])
                assert(invokeList['invokables'][testInovkeName])
                assetId = removeLeadingHexZero(extractAssetId(invokeList['invokables'][testInovkeName]))
                invokeAsset = await agent.getAsset(assetId)
            })
            describe('invoke', () => {
                let testNumber: number
                let inputs
                before( () => {
                    testNumber = Math.random() * 100
                    inputs = {
                        n: testNumber
                    }
                })
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
                    assert(result['job-id'])
                })
            })
        })
    })
})
