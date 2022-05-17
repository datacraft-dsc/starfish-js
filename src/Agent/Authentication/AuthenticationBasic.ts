/**
 *
 * AuthenticationBasic class to provide basic username/password authentication
 *
 *
 */

// import { IAgentAuthentication } from './Interfaces/IAgentAuthentication'

import { Authentication } from './Authentication'

export class AuthenticationBasic extends Authentication {
    public username: string
    public password: string

    public constructor(username: string, password: string) {
        super()
        this.username = username
        this.password = password
    }

    public is_access(access_data: string): boolean {
        return this.username && this.password && this.password === access_data
    }
}
