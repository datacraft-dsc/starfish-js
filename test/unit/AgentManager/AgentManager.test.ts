/*
 *
 *     Test AgentManager Class
 *
 *
 */

import { assert } from 'chai'

import { AgentManager } from 'starfish'
import { loadTestSetup } from 'test/TestSetup'
// import { ConvexNetwork, extractAssetId, DataAsset, RemoteAgent, removeLeadingHexZero, OperationAsset } from 'starfish'

//const invokeList = await enableSurferInvokableOperations(agentConfig['url'], agentConfig['username'], agentConfig['password'])
let setup = loadTestSetup()
const agentConfig = setup.agents


describe('AgentManager Class', () => {

    describe('load a list of agents from resource', () => {
        it('should load predifined agent list', async () => {
            const agentManager = AgentManager.getInstance()
            assert(agentManager)
            agentManager.registerAgents(agentConfig)
        })
    })
})
