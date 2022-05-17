/**
 *
 * Base Authentication class to provide authentication details
 *
 *
 */

import { IAgentAuthentication } from '../IAgentAuthentication'

export class Authentication implements IAgentAuthentication {
    public username: string
    public password: string
    public token: string

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public is_access(access_data: string): boolean {
        return false
    }
}
