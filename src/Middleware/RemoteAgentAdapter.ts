/*
 *
 *
 *    Remote Agent Adapter class
 *
 *
 *
 */

import fetch, { Headers } from 'node-fetch'
import { Base64 } from 'js-base64'
import urljoin from 'url-join'
import queryString from 'query-string'

export interface IListingData {
    trust_level: number
    userid: string
    assetid: string
    agreement?: string
    ctime: string
    status: string
    id: string
    info: any
    utime: string
}

interface IListingRequestData {
    assetid: string
    info: any
}

export interface IListingFilter {
    username?: string
    userid?: string
    from?: number
    size?: number
}

export class RemoteAgentAdapter {
    public static getInstance(): RemoteAgentAdapter {
        if (!RemoteAgentAdapter.instance) {
            RemoteAgentAdapter.instance = new RemoteAgentAdapter()
        }
        return RemoteAgentAdapter.instance
    }

    protected static createHeaders(contentType?: string, token?: string): Headers {
        const headers = new Headers()
        if (contentType) {
            headers.set('content-type', contentType)
        }
        if (token) {
            headers.set('Authorization', `token ${token}`)
        }
        return headers
    }

    private static instance

    public async getAuthorizationToken(username: string, password: string, url: string): Promise<string> {
        const auth = Base64.encode(`${username}:${password}`)
        const headers = new Headers({
            Authorization: `Basic ${auth}`,
        })
        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        })
        if (!response.ok) {
            throw new Error(`Unable to get access token from ${url} error: ${response.status}`)
        }
        const tokenList = await response.json()
        if (tokenList && tokenList.length > 0) {
            return tokenList[tokenList.length - 1]
        }
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to create new token from ${url} error: ${response.status}`)
    }

    public async getDDO(url: string, token?: string): Promise<string> {
        const ddoURL = urljoin(url, '/api/ddo')
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(ddoURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.text()
        }
        throw new Error(`Unable to get DDO information from url ${ddoURL} error: ${response.status}`)
    }

    public async saveMetadata(metadataText: string, url: string, token?: string): Promise<string> {
        const metadatURL = urljoin(url, '/data')
        const headers = RemoteAgentAdapter.createHeaders('text/plain', token)
        const response = await fetch(metadatURL, {
            method: 'POST',
            body: metadataText,
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to save asset metadata at url ${metadatURL} error: ${response.status}`)
    }

    public async readMetadata(assetId: string, url: string, token?: string): Promise<string> {
        const metadatURL = urljoin(url, `/data/${assetId}`)
        const headers = RemoteAgentAdapter.createHeaders('text/plain', token)
        const response = await fetch(metadatURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.text()
        }
        throw new Error(`Unable to read asset metadata at url ${metadatURL} error: ${response.status}`)
    }

    public async getMetadataList(url: string, token?: string): Promise<any> {
        const metadatURL = urljoin(url, '/index')
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(metadatURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to read metadata list at url ${metadatURL} error: ${response.status}`)
    }

    public async addListing(listingText: string, assetId: string, url: string, token?: string): Promise<IListingData> {
        const listingURL = urljoin(url, '/listings')
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const data: IListingRequestData = {
            assetid: assetId,
            info: JSON.parse(listingText),
        }
        const response = await fetch(listingURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to add listing data at url ${listingURL} error: ${response.status}`)
    }
    public async getListing(listingId: string, url: string, token?: string): Promise<IListingData> {
        const listingURL = urljoin(url, `/listings/${listingId}`)
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(listingURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to get listing data at url ${listingURL} error: ${response.status}`)
    }
    public async getListingList(filter: IListingFilter, url: string, token?: string): Promise<Array<IListingData>> {
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const listingURL = urljoin(url, `/listings/${queryString.stringify(filter)}`)
        const response = await fetch(listingURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Unable to get a list of listing items at url ${listingURL} error: ${response.status}`)
    }
    public async updateListing(listingId: string, listingDataText: string, url: string, token?: string): Promise<boolean> {
        const listingURL = urljoin(url, `/listings/${listingId}`)
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(listingURL, {
            method: 'PUT',
            headers: headers,
            body: listingDataText,
        })
        if (response.ok) {
            return true
        }
        throw new Error(`Unable to get listing data at url ${listingURL} error: ${response.status}`)
    }
}
