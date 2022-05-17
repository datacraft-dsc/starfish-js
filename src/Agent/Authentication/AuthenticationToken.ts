/**
 *
 * AuthenticationToken class to provide token authentication
 *
 *
 */

// import { IAgentAuthentication } from './Interfaces/IAgentAuthentication'
import { Authentication } from './Authentication'

export class AuthenticationToken extends Authentication {
    public token: string

    public constructor(token: string) {
        super()
        this.token = token
    }

    public is_access(access_data: string): boolean {
        return this.token && this.token === access_data
    }
}
