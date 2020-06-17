/*
 *
 *     Test RemoteAgent Class
 *
 *
 */

import { assert } from 'chai'
import { randomHex, hexToBytes } from 'web3-utils'


import { RemoteAgent } from 'starfish/Agent/RemoteAgent'
import { loadTestSetup } from 'test/TestSetup'
import { DataAsset } from 'starfish/Asset'
import { Network } from 'starfish/Network'


let setup = loadTestSetup()
const agentConfig = setup.agents['local']
const agentAuthentication = {
    username: agentConfig['username'],
    password: agentConfig['password'],
}

describe('RemoteAgent', () => {
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

    describe('registerAsset', () => {
        let network
        let agent
        before( async () => {
            network = Network.getInstance(setup.network.url);
            agent = await RemoteAgent.createFromAddress(agentConfig['url'], network, agentAuthentication)
        })
        it('should register a data asset', async () => {
            const data = Buffer.from(hexToBytes(randomHex(1024)))
            const asset = DataAsset.create('testAsset', data)
            const registerAsset = await agent.registerAsset(asset)
            assert(registerAsset)
            assert(registerAsset.did)
        })
    })

    describe('getAsset', () => {
        let network
        let agent
        let data
        let registerAsset
        before( async () => {
            network = Network.getInstance(setup.network.url);
            agent = await RemoteAgent.createFromAddress(agentConfig['url'], network, agentAuthentication)
            data = Buffer.from(hexToBytes(randomHex(1024)))
            const asset = DataAsset.create('testAsset', data)
            registerAsset = await agent.registerAsset(asset)
        })
        it('should read asset from the remote agent', async () => {
            const readAsset = await agent.getAsset(registerAsset.did)
            assert(readAsset)
            assert(readAsset.did)
            assert.equal(readAsset.metadataText, registerAsset.metadataText)
        })
    })

})
