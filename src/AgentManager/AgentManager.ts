/**
 *
 * AgentManager class to maintain and resolve agents
 *
 *
 */

import { AgentAccess } from './AgentAccess'
import { Authentication } from '../Agent/Authentication/Authentication'
import { AuthenticationBasic } from '../Agent/Authentication/AuthenticationBasic'
import { AuthenticationToken } from '../Agent/Authentication/AuthenticationToken'
import { ConvexNetwork } from '../Network/Convex/ConvexNetwork'
import { DDO } from '../DDO/DDO'
import { IAgentAuthentication } from '../Agent/IAgentAuthentication'
import { IAgentData } from '../Agent/IAgentData'
import { RemoteAgent } from '../Agent/RemoteAgent'
import { IAgentItems, IAgentItem } from './IAgentItems'
import { isDID } from '../Utils'

export class AgentManager {
    /**
     * Return a instance of a EthereumNetwork object.
     * @param url URL of the convex network.
     *
     * @return The current ConvexNetwork object
     * @category Static Create
     */
    public static getInstance(network?: ConvexNetwork): AgentManager {
        if (!AgentManager.instance) {
            AgentManager.instance = new AgentManager()
        }
        AgentManager.instance.init(network)
        return AgentManager.instance
    }

    private static instance
    public network: ConvexNetwork
    public agents: { [index: string]: AgentAccess } = {}
    public localName = '_local_agent'

    constructor() {
        this.network = null
    }

    public static createAuthentication(authentication: IAgentAuthentication): Authentication | null {
        if (authentication['username']) {
            return new AuthenticationBasic(authentication['username'], authentication['password'])
        } else if (authentication['token']) {
            return new AuthenticationToken(authentication['token'])
        }
        return null
    }

    /**
     * Initialize the starfish object using a url or Provider and arfitfacts path. It is better
     * to call {@link getInstance} to create a new EthereumNetwork object.
     * @param url URL of the network.
     * @param artifactsPath Path to the artifacts files that contain the contract ABI and address.
     */
    public init(network?: ConvexNetwork): void {
        this.network = network
    }

    public registerAgents(agentItems: IAgentItems): void {
        for (const agentName in agentItems) {
            const agentItem = agentItems[agentName]
            this.registerAgent(agentName, agentItem)
        }
    }

    public registerAgent(name: string, item: IAgentItem): AgentAccess {
        let authentication
        if (item['token']) {
            authentication = new AuthenticationToken(item['token'])
        } else if (item['username']) {
            authentication = new AuthenticationBasic(item['username'], item['password'])
        }
        const agentAccess = new AgentAccess(name, <IAgentData>item, authentication)
        this.agents[name] = agentAccess
        return agentAccess
    }

    public registerLocalAgent(ddo: DDO | string, agentAuthentication?: IAgentAuthentication, localName?: string): AgentAccess {
        let ddoText
        if (typeof ddo == 'string') {
            ddoText = ddo
        } else {
            ddoText = (<DDO>ddo).toString()
        }
        if (localName) {
            this.localName = localName
        }
        const authentication = AgentManager.createAuthentication(agentAuthentication)
        const agentAccess = new AgentAccess(this.localName, { ddo: ddoText }, authentication)
        this.agents[this.localName] = agentAccess
        return agentAccess
    }

    public async loadAgentFromURL(url: string, agentAuthentication?: IAgentAuthentication): Promise<RemoteAgent> {
        const authentication = AgentManager.createAuthentication(agentAuthentication)
        const ddoText = await AgentAccess.resolveAgentURL(url, authentication)
        if (ddoText) {
            return new RemoteAgent(ddoText, authentication)
        }
        return null
    }

    public async loadAgentFromDID(
        did: string,
        agentAuthentication?: IAgentAuthentication,
        network?: ConvexNetwork
    ): Promise<RemoteAgent> {
        if (network) {
            this.network = network
        }
        if (!this.network) {
            throw Error('no network set for resolving a did')
        }
        const authentication = AgentManager.createAuthentication(agentAuthentication)
        const ddoText = await AgentAccess.resolveAgentDID(did, this.network)
        if (ddoText) {
            return new RemoteAgent(ddoText, authentication)
        }
        return null
    }

    public async loadAgent(
        name_did_url: string,
        agentAuthentication?: IAgentAuthentication,
        network?: ConvexNetwork
    ): Promise<RemoteAgent> {
        const authentication = AgentManager.createAuthentication(agentAuthentication)
        const agentAccess = await this.findAgent(name_did_url)
        if (agentAccess) {
            return agentAccess.loadAgent(authentication)
        }
        if (isDID(name_did_url)) {
            return this.loadAgentFromDID(name_did_url, agentAuthentication, network)
        }

        return this.loadAgentFromURL(name_did_url, agentAuthentication)
    }

    public async loadDDO(name_did_url: string): Promise<DDO> {
        const agentAccess = await this.findAgent(name_did_url)
        if (agentAccess) {
            return agentAccess.ddo()
        }
        return null
    }

    public async findAgent(name_did_url: string, isAutoResolve = true): Promise<AgentAccess> {
        for (const agentName in this.agents) {
            const item = this.agents[agentName]
            if (item.isMatch(name_did_url)) {
                if (item.isDDO()) {
                    return item
                }
            }
        }
        if (isAutoResolve) {
            await this.resolveAccessAgents()
            return await this.findAgent(name_did_url, false)
        }
        return null
    }

    public isAgent(name_did_url: string): boolean {
        const agentAccess = this.findAgent(name_did_url)
        return agentAccess != null
    }

    public async resolveAccessAgents(): Promise<boolean> {
        for (const agentName in this.agents) {
            const item = this.agents[agentName]
            if (!item.isDDO()) {
                if (this.network && item.did) {
                    await item.resolveDID(this.network)
                } else if (item.url) {
                    item.resolveURL()
                }
            }
        }
        return true
    }
}
