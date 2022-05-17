/*
 *
 *     Test Agent Class
 *
 *
 */
import { assert } from 'chai'

import { AgentBase, DDO } from 'starfish'

describe('AgentBase', () => {
    describe('constructor', () => {
        it('should create a new AgentBase object', async () => {
            const ddo = DDO.createForAllServices('localhost')
            const agent = new AgentBase(ddo.toString())
            assert(agent)
        })
    })
})
