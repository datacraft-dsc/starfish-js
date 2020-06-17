/*
 *
 *
 *    Remote Agent class
 *
 *
 *
 */

import urljoin from 'url-join'

import { RemoteAgentAdapter } from 'starfish/Middleware/RemoteAgentAdapter'
import { AgentBase } from './AgentBase'
//import { IAsset } from 'starfish/Interfaces/IAsset'
import { AssetBase } from 'starfish/Asset/AssetBase'
import { DataAsset } from 'starfish/Asset/DataAsset'
import { OperationAsset } from 'starfish/Asset/OperationAsset'
import { IAgentAuthentication } from 'starfish/Interfaces/IAgentAuthentication'
import { IInvokeResult } from 'starfish/Interfaces/IInvoke'
import { isDID, extractAssetId } from 'starfish/Utils'
import { Network } from 'starfish/Network'
import { DDO } from 'starfish/DDO/DDO'

export class RemoteAgent extends AgentBase {
    public authentication: IAgentAuthentication

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

    public static async createFromAddress(
        agentAddress: string,
        network?: Network,
        authentication?: IAgentAuthentication
    ): Promise<RemoteAgent> {
        let ddo = null
        if (isDID(agentAddress)) {
            if (network) {
                ddo = await network.resolveAgent(agentAddress)
            }
        } else {
            const ddoText = await RemoteAgent.resolveURL(agentAddress, authentication)
            if (ddoText) {
                ddo = DDO.createFromString(ddoText)
            }
        }
        if (ddo) {
            return new RemoteAgent(ddo, authentication)
        }
        return null
    }

    constructor(ddo: DDO, authentication?: IAgentAuthentication) {
        super(ddo)
        this.authentication = authentication
    }

    public async registerAsset(asset: AssetBase): Promise<AssetBase> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('meta')
        const assetId = await adapter.saveMetadata(asset.metadataText, url, token)
        asset.did = this.generateDIDForAsset(assetId)
        return asset
    }

    public async getAsset(assetId: string): Promise<AssetBase> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('meta')
        const safeAssetId = extractAssetId(assetId)
        const metadata = await adapter.readMetadata(safeAssetId, url, token)
        return new AssetBase(metadata, this.generateDIDForAsset(safeAssetId))
    }

    public async uploadAsset(asset: DataAsset): Promise<boolean> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('storage')
        const assetId = asset.getAssetId()
        return adapter.uploadAssetData(assetId, asset.data, url, token)
    }

    public async downloadAsset(assetDIDorId: string): Promise<DataAsset> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('storage')
        const assetId = extractAssetId(assetDIDorId)
        const asset: DataAsset = <DataAsset>await this.getAsset(assetId)
        asset.data = await adapter.downloadAssetData(assetId, url, token)
        return asset
    }

    public async invoke(asset: string | OperationAsset, inputs?: any, isAsync?: boolean): Promise<IInvokeResult> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('invoke')
        let assetId
        if (typeof asset == 'string') {
            assetId = extractAssetId(asset)
        } else {
            assetId = asset.getAssetId()
        }
        let inputsText = ''
        if (inputs) {
            inputsText = JSON.stringify(inputs)
        }
        return adapter.invoke(assetId, inputsText, isAsync, url, token)
    }

    protected async getAuthorizationToken(): Promise<string> {
        if (!this.authentication) {
            return null
        }
        if (this.authentication['token']) {
            return this.authentication['token']
        }
        const tokenURL = this.getEndpoint('auth', 'token')
        const adapter = RemoteAgentAdapter.getInstance()
        return adapter.getAuthorizationToken(this.authentication['username'], this.authentication['password'], tokenURL)
    }
}
