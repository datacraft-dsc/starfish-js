/*
 *
 *
 *          Base class for all agents
 *
 *
 *
 */

import { urlJoin } from 'url-join-ts'
import { DDO } from '../DDO/DDO'

export class AgentBase {
    public ddoText: string
    public ddo: DDO

    /**
     * Construct a base agent using it's DDO.
     */
    constructor(ddoText: string) {
        this.ddoText = ddoText
        this.ddo = DDO.createFromString(ddoText)
    }

    /**
     * @internal
     * Obtain the service endpoint.
     * @param name Name of the endpoint to get
     * @Param uri URI to append to the found endpoint
     * @returns The full URL of the service, or null if not found
     */
    protected getEndpoint(name: string, uri?: string): string {
        const service = this.ddo.findService(name)
        if (service) {
            const url = service['serviceEndpoint']
            if (uri) {
                return urlJoin(url, uri)
            }
            return url
        }
        return null
    }

    /**
     * Generate a full assetDID using the assetId.
     * @param assetId assetId to use to generate the full asset DID.
     * @returns The full assetDID in the format `agentDID/assetId`
     */
    protected generateDIDForAsset(assetId: string): string {
        return `${this.ddo.id}/${assetId}`
    }

    /**
     * Get the current DID of the agent.
     */
    protected getDID(): string {
        return this.ddo.id
    }
}
