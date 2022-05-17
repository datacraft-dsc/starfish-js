/**
 *
 * AgentAccess class to hold the cached agent access details
 *
 *
 */

// import { ConvexNetwork } from './Network/Convex/ConvexNetwork'

import { Authentication } from '../Agent/Authentication/Authentication'
import { ConvexNetwork } from '../Network/Convex/ConvexNetwork'
import { IAgentData } from '../Agent/IAgentData'
import { DDO } from '../DDO/DDO'
import { RemoteAgent } from '../Agent/RemoteAgent'

export class AgentAccess {
    public name: string
    public data: IAgentData
    public authentication: Authentication
    public ddoObject: DDO

    public constructor(name: string, data: IAgentData, authentication: Authentication) {
        this.name = name
        this.data = data
        this.authentication = authentication
        this.ddo = undefined
    }

    public static async resolveAgentURL(url: string, authentication?: Authentication): Promise<string> {
        return RemoteAgent.resolveURL(url, authentication)
    }

    public static async resolveAgentDID(did: string, network: ConvexNetwork): Promise<string> {
        return await network.resolveAgentDID(did)
    }

    public async resolveURL(): Promise<string> {
        if (this.data.url) {
            AgentAccess.resolveAgentURL(this.data.url, this.authentication).then((ddoText) => {
                if (ddoText) {
                    this.data.ddo = ddoText
                    this.data.did = this.ddo().getDID()
                    return ddoText
                }
            })
        }
        return null
    }

    public async resolveDID(network: ConvexNetwork): Promise<string> {
        if (this.data.did) {
            network.resolveAgentDID(this.data.did).then((ddoText) => {
                if (ddoText) {
                    this.data.ddo = ddoText
                    this.data.did = this.ddo().getDID()
                    return ddoText
                }
            })
        }
        return null
    }

    public loadAgent(authentication?: Authentication): RemoteAgent {
        if (this.data.ddo) {
            return new RemoteAgent(this.data.ddo, authentication)
        }
        return null
    }

    public url(): string {
        return this.data.url
    }

    public ddoText(): string {
        return this.data.ddo
    }
    public ddo(): DDO {
        if (this.ddoObject == undefined) {
            this.ddoObject = DDO.createFromString(this.data.ddo)
        }
        return this.ddoObject
    }

    public did(): string {
        return this.data.did
    }

    public isDDO(): boolean {
        return this.data.ddo != undefined
    }

    public isMatch(name_did_url: string): boolean {
        if (name === name_did_url) {
            return true
        } else if (this.data.did && this.data.did === name_did_url) {
            return true
        } else if (this.data.url && this.data.url === name_did_url) {
            return true
        }
        return false
    }
}
