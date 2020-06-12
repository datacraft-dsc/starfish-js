/*
 *
 *     Test Agent Class
 *
 *
 */
import { assert } from 'chai'


import fetch, { Headers } from 'node-fetch'
import { Base64 } from 'js-base64'
import urljoin from 'url-join'

import { loadTestSetup } from 'test/TestSetup'


let setup = loadTestSetup()
const agentConfig = setup.agents['local']

describe('Agent basic fetch using authorization', () => {
    it('should fetch a valid token', async () => {
        const tokenURL = urljoin(agentConfig['url'], '/api/v1/auth/token')
        const auth = Base64.encode(`${agentConfig['username']}:${agentConfig['password']}`)
        const headers = new Headers( {
            Authorization: `Basic ${auth}`
        })
        const response = await fetch(tokenURL, {
            method: 'GET',
            headers: headers
        })
        assert(response)
        assert(response.ok)
        assert.isFulfilled(response.json())
    })
})
