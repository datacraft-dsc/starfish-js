/*
 *
 *
 *    Remote Agent class
 *
 *
 *
 */

import urljoin from 'url-join'

import { RemoteAgentAdapter } from '../Middleware/RemoteAgentAdapter'
import { AgentBase } from './AgentBase'

export interface IAgentAuthentication {
    username: string
    password?: string
    token?: string
}

export class RemoteAgent extends AgentBase {
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
}
