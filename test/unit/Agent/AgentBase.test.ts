/*
 *
 *     Test Agent Class
 *
 *
 */
import { assert } from 'chai'

import { DDO } from 'starfish/DDO/DDO'
import { AgentBase } from 'starfish/Agent/AgentBase'

describe('AgentBase', () => {
    describe('constructor', () => {
        it('should create a new AgentBase object', async () => {
            const ddo = DDO.createForAllServices('localhost')
            const agent = new AgentBase(ddo)
            assert(agent)
        })
    })
})
