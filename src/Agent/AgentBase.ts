/*
 *
 *
 *          Base class for all agents
 *
 *
 *
 */

import urljoin from 'url-join'
import { DDO } from 'starfish/DDO/DDO'

export class AgentBase {
    public ddo: DDO

    constructor(ddo: DDO) {
        this.ddo = ddo
    }

    protected getEndpoint(name: string, uri?: string): string {
        const service = this.ddo.findService(name)
        if (service) {
            const url = service['serviceEndpoint']
            if (uri) {
                return urljoin(url, uri)
            }
            return url
        }
        return null
    }
    protected generateDIDForAsset(assetId: string): string {
        return `${this.ddo.id}/${assetId}`
    }
    protected getDID(): string {
        return this.ddo.id
    }
}
