/*
 *
 *
 *    Remote Agent class
 *
 *
 *
 */

import urljoin from 'url-join'

import { RemoteAgentAdapter } from 'starfish/Middleware/RemoteAgentAdapter'
import { AgentBase } from './AgentBase'
import { IAgentAuthentication } from 'starfish/Interfaces/IAgentAuthentication'
import { IDDO } from 'starfish/Interfaces/IDDO'

export class RemoteAgent extends AgentBase {
    // private authentication: IAgentAuthentication

    public static async resolveURL(url: string, authentication?: IAgentAuthentication): Promise<string> {
        let token = null
        const adapter = RemoteAgentAdapter.getInstance()
        if (authentication) {
            token = authentication.token

            if (!token) {
                const tokenURL = urljoin(url, '/api/v1/auth/token')
                token = await adapter.getAuthorizationToken(authentication['username'], authentication['password'], tokenURL)
            }
        }
        return adapter.getDDO(url, token)
    }

    constructor(ddo: IDDO, authentication?: IAgentAuthentication) {
        super(ddo)
        // this.authentication = authentication
    }
}
