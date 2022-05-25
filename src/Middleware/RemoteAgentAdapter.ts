/*
 *
 *
 *    Remote Agent Adapter class
 *
 *
 *
 */

import fetch, { Headers, Response } from 'node-fetch'
import { Base64 } from 'js-base64'
import { urlJoin } from 'url-join-ts'
import queryString from 'query-string'
import FormData from 'form-data'

import { IMetaDataList } from '../Asset/IMetaData'
import { IListingData, IListingRequestData, IListingFilter } from '../Asset/IListing'
import { IInvokeResult } from '../Asset/IInvoke'

export class RemoteAgentAdapter {
    public static getInstance(): RemoteAgentAdapter {
        if (!RemoteAgentAdapter.instance) {
            RemoteAgentAdapter.instance = new RemoteAgentAdapter()
        }
        return RemoteAgentAdapter.instance
    }

    protected static throwError(message: string, response: Response): never {
        throw new Error(
            `RemoteAgentAdapter: ${message} from \n${response.url}\n with error ${response.status}:${response.statusText}`
        )
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
            RemoteAgentAdapter.throwError('Unable to get access token', response)
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
        RemoteAgentAdapter.throwError('Unable to create new token', response)
    }

    public async getDDO(url: string, token?: string): Promise<string> {
        const ddoURL = urlJoin(url, '/api/ddo')
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(ddoURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.text()
        }
        RemoteAgentAdapter.throwError('Unable to get DDO information', response)
    }

    public async saveMetadata(metadataText: string, url: string, token?: string): Promise<string> {
        const metadatURL = urlJoin(url, '/data')
        const headers = RemoteAgentAdapter.createHeaders('text/plain', token)
        const response = await fetch(metadatURL, {
            method: 'POST',
            body: metadataText,
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to save asset metadata', response)
    }

    public async readMetadata(assetId: string, url: string, token?: string): Promise<string> {
        const metadatURL = urlJoin(url, `/data/${assetId}`)
        const headers = RemoteAgentAdapter.createHeaders('text/plain', token)
        const response = await fetch(metadatURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.text()
        }
        RemoteAgentAdapter.throwError('Unable to read asset metadata', response)
    }

    public async getMetaDataList(url: string, token?: string): Promise<IMetaDataList> {
        const metadatURL = urlJoin(url, '/index')
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(metadatURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to read metadata list', response)
    }

    public async addListing(listingText: string, assetId: string, url: string, token?: string): Promise<IListingData> {
        const listingURL = urlJoin(url, '/listings')
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
        RemoteAgentAdapter.throwError('Unable to add listing data', response)
    }
    public async getListing(listingId: string, url: string, token?: string): Promise<IListingData> {
        const listingURL = urlJoin(url, `/listings/${listingId}`)
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(listingURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to get listing data', response)
    }
    public async getListingList(filter: IListingFilter, url: string, token?: string): Promise<Array<IListingData>> {
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const listingURL = urlJoin(url, `/listings/${queryString.stringify(filter)}`)
        const response = await fetch(listingURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to get a list of listing items', response)
    }
    public async updateListing(listingData: IListingData, url: string, token?: string): Promise<IListingData> {
        const listingURL = urlJoin(url, `/listings/${listingData.id}`)
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(listingURL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(listingData),
        })
        if (response.ok) {
            return this.getListing(listingData.id, url, token)
        }
        RemoteAgentAdapter.throwError('Unable to get listing data', response)
    }
    public async uploadAssetData(assetId: string, data: Buffer, url: string, token?: string): Promise<boolean> {
        const storageURL = urlJoin(url, `/${assetId}`)

        // formData.getHeaders does not read node-fetch Headers object, so we need to create a simple object instead.
        const headers = {}
        if (token) {
            headers['Authorization'] = `token ${token}`
        }

        const form = new FormData()
        form.append('file', data, {
            filename: assetId,
            contentType: 'application/octet-stream',
        })
        const response = await fetch(storageURL, {
            method: 'POST',
            body: form,
            headers: form.getHeaders(headers),
        })
        if (response.ok) {
            return true
        }
        RemoteAgentAdapter.throwError('Unable to upload asset data', response)
    }
    public async downloadAssetData(assetId: string, url: string, token?: string): Promise<Buffer> {
        const storageURL = urlJoin(url, `/${assetId}`)
        const headers = RemoteAgentAdapter.createHeaders('application/octet-stream', token)
        const response = await fetch(storageURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return await response.buffer()
        }
        RemoteAgentAdapter.throwError('Unable to download asset data', response)
    }
    public async invoke(assetId: string, inputText: string, isAsync: boolean, url: string, token?: string): Promise<IInvokeResult> {
        let invokeURL = urlJoin(url, `/sync/${assetId}`)
        if (isAsync) {
            invokeURL = urlJoin(url, `/async/${assetId}`)
        }
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(invokeURL, {
            method: 'POST',
            headers: headers,
            body: inputText,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to call invoke', response)
    }
    public async getJob(jobId: string, url: string, token?: string): Promise<IInvokeResult> {
        const invokeURL = urlJoin(url, `/jobs/${jobId}`)
        const headers = RemoteAgentAdapter.createHeaders('application/json', token)
        const response = await fetch(invokeURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.ok) {
            return response.json()
        }
        RemoteAgentAdapter.throwError('Unable to get job', response)
    }
}
