/**
 *  @category Agent
 *  @preferred
 *
 *    Remote Agent class
 *
 *
 *
 */

import urljoin from 'url-join'

import { RemoteAgentAdapter } from '../Middleware/RemoteAgentAdapter'
import { AgentBase } from './AgentBase'
//import { IAsset } from 'starfish/Interfaces/IAsset'
import { AssetBase, DataAsset, OperationAsset } from '../Asset/Asset'
import { IAgentAuthentication } from '../Interfaces/IAgentAuthentication'
import { IInvokeResult } from '../Interfaces/IInvoke'
import { isDID, extractAssetId } from '../Utils'
import { Network } from '../Network'
import { DDO } from '../DDO/DDO'

export class RemoteAgent extends AgentBase {
    /**
     *
     */
    public authentication: IAgentAuthentication

    /**
     * Using the provided URL resolve the Agent DDO and return the DDO as a JSON text. Some agents require login access
     * to obtain their internal DDO record to resolve.
     * @param url URL of the agent to get the DDO and resolve.
     * @param authentication Authentication interface to set if the Agent requires authentication access to it's api.
     * @returns String of the DDO JSON text or null if the agent is not found or the authentication is invalid.
     */
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

    /**
     * Create a new RemoteAgent object using the agent's address.
     * The address can be a URL, DID or Asset DID
     * @param agentAddress URL, DID or Asset DID of the agent to resolve.
     * @param network Network object to resolve all DID's. If non provided only a URL resolve will work.
     * @param authentication For URL resolving you need to provide an optional authentication data to access the remote agent.
     * @returns RemoteAgent object if successful or null
     */
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

    /**
     * Construct an new Remote Agent object. Please use {@link createFromAddress} to correctly resolve the agent
     * and obtain the correct DDO record.
     * @param ddo DDO to use for this agent.
     * @param authentication Authentication data needed for Agent access.
     */
    constructor(ddo: DDO, authentication?: IAgentAuthentication) {
        super(ddo)
        this.authentication = authentication
    }

    /**
     * Register a new asset with this agent.
     * @param asset Asset to register.
     * @returns The asset with the DID and assetId set
     */
    public async registerAsset(asset: AssetBase): Promise<AssetBase> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('meta')
        const assetId = await adapter.saveMetadata(asset.metadataText, url, token)
        asset.did = this.generateDIDForAsset(assetId)
        return asset
    }

    /**
     * Get an asset from the agent.
     * @param assetId This can be a full assetDID `<agentDID>/<assetId>` or just an assetId
     * @returns The asset found saved in the remote agent, else null for not found.
     */
    public async getAsset(assetId: string): Promise<AssetBase> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('meta')
        const safeAssetId = extractAssetId(assetId)
        const metadata = await adapter.readMetadata(safeAssetId, url, token)
        return new AssetBase(metadata, this.generateDIDForAsset(safeAssetId))
    }

    /**
     * Upload data asset's data.
     * @param asset Data asset data to upload.
     * @return True if uploaded
     */
    public async uploadAsset(asset: DataAsset): Promise<boolean> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('storage')
        const assetId = asset.getAssetId()
        return adapter.uploadAssetData(assetId, asset.data, url, token)
    }

    /**
     * Download the assets data from the remote agent.
     * @param assetDIDorId AssetDID or assetId of the asset to download
     * @returns DataAsset with the data downloaded, or null for no asset found.
     */
    public async downloadAsset(assetDIDorId: string): Promise<DataAsset> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('storage')
        const assetId = extractAssetId(assetDIDorId)
        const asset: DataAsset = <DataAsset>await this.getAsset(assetId)
        asset.data = await adapter.downloadAssetData(assetId, url, token)
        return asset
    }

    /**
     * Invoke an operation on the remote Agent.
     * @param asset This can be a string for an assetDID or assetID,
     * or an OperationAsset that has been read using {@link getAsset}.
     * @param asset AssetId or AssetDID as a string, or OperationAsset.
     * @param inputs Object for the invoke service to be passed.
     * @Param isAsync If true run the invokable service as async, defaults to False - run as a sync service.
     * @returns The `outputs` and `status`, if the invoke is sync, else for async just return the `job-id`
     */
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

    /**
     * Get a job from the remote agent.
     * @param jobId Job id string or the InvokeResult returned by the async invoke call.
     * @returns A new InovkeResult on the status and results of the running job.
     */
    public async getJob(jobId: string | IInvokeResult): Promise<IInvokeResult> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('invoke')
        let safeJobId
        if (typeof jobId === 'string') {
            safeJobId = jobId
        } else {
            safeJobId = jobId['job-id']
        }
        return adapter.getJob(safeJobId, url, token)
    }

    /**
     * Used internally to obtain a new OAuth token.
     */
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
