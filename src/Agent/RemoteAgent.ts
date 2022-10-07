/**
 *
 *
 *    Remote Agent class
 *
 *
 *
 */

import { urlJoin } from 'url-join-ts'

import { RemoteAgentAdapter } from '../Middleware/RemoteAgentAdapter'
import { AgentBase } from './AgentBase'
import { AssetBase, DataAsset, OperationAsset, createAsset } from '../Asset/Asset'
import { IAgentAuthentication } from '../Agent/IAgentAuthentication'
import { IListingData, IListingFilter } from '../Asset/IListing'
import { IMetaData, IMetaDataList } from '../Asset/IMetaData'
import { IInvokeResult } from '../Asset/IInvoke'
import { didToAssetId, isDID } from '../DID'
import { isAssetId } from '../Utils'


// import { DDO } from '../DDO/DDO'

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
                const tokenURL = urlJoin(url, '/api/v1/auth/token')
                token = await adapter.getAuthorizationToken(authentication['username'], authentication['password'], tokenURL)
            }
        }
        return adapter.getDDO(url, token)
    }

    /**
     * Create a new RemoteAgent object using the agent's address.
     * The address can be a URL, DID or Asset DID
     * @param agentAddress URL, DID or Asset DID of the agent to resolve.
     * @param network EthereumNetwork object to resolve all DID's. If non provided only a URL resolve will work.
     * @param authentication For URL resolving you need to provide an optional authentication data to access the remote agent.
     * @returns RemoteAgent object if successful or null
     * @category Static Create
     */
    /*
    public static async createFromAddress(
        agentAddress: string,
        network?: EthereumNetwork,
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
    */
    /**
     * Construct an new Remote Agent object. Please use {@link createFromAddress} to correctly resolve the agent
     * and obtain the correct DDO record.
     * @param ddo DDO to use for this agent.
     * @param authentication Authentication data needed for Agent access.
     */
    constructor(ddoText: string, authentication?: IAgentAuthentication) {
        super(ddoText)
        this.authentication = authentication
    }

    public async getMetaDataList(): Promise<IMetaDataList> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('meta')
        return await adapter.getMetaDataList(url, token)
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
        const safeAssetId = didToAssetId(assetId)
        const metadata = await adapter.readMetadata(safeAssetId, url, token)
        return createAsset(metadata, this.generateDIDForAsset(safeAssetId))
    }

    public async findAsset(filter: IMetaData): Promise<IMetaDataList> {
        const result: IMetaDataList = {}
        const metaDataList = await this.getMetaDataList()
        for (const assetId in metaDataList) {
            const metaData = metaDataList[assetId]
            let isFound = true
            for (const filterKey in filter) {
                if (filter[filterKey] !== metaData[filterKey]) {
                    isFound = false
                    break
                }
            }
            if (isFound) {
                result[assetId] = metaData
            }
        }
        return result
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
        const assetId = didToAssetId(assetDIDorId)
        const asset: DataAsset = <DataAsset>await this.getAsset(assetId)
        asset.data = await adapter.downloadAssetData(assetId, url, token)
        return asset
    }

    /**
     * Create a new listing on the remote agent.
     * @param listingInfo An object that contains all of the listing information.
     * @param assedDIDorId Asset DID or assetId for the associtated asset for this listing.
     * @returns A listing data object. This contains the information saved by the remote agent as well as the `.info` property,
     * which contains the `listingInfo`.
     */
    public async createListing(listingInfo: unknown, assetDIDorId: string): Promise<IListingData> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('market')
        const assetId = didToAssetId(assetDIDorId)
        const listingText = JSON.stringify(listingInfo)
        return adapter.addListing(listingText, assetId, url, token)
    }

    /**
     * Update a listing. You need to get the listingData by calling the @{link getListing} or {@link createListing}.
     * @param listingData The full listing data object that was returned after a @{link getListing} or {@link createListing}.
     * @returns a new updated IListingData object.
     */
    public async updateListing(listingData: IListingData): Promise<IListingData> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('market')
        return adapter.updateListing(listingData, url, token)
    }

    /**
     * Get a listing from the remote Agent.
     * @param listingId Id of the listing data.
     * @returns a valid IListingData Object.
     */
    public async getListing(listingId: string): Promise<IListingData> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('market')
        return adapter.getListing(listingId, url, token)
    }

    /**
     * Get a list of listing data objects.
     * @param filter The filter to use to get a list of listing data items.
     * @returns an Array of IListingData items found using the filter.
     */
    public async getListingList(filter: IListingFilter): Promise<Array<IListingData>> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('market')
        return adapter.getListingList(filter, url, token)
    }

    /**
     * Invoke an operation on the remote Agent.
     * @param assetOrName This can be a string for an assetDID, assetID or name of the operation
     * or an OperationAsset that has been read using {@link getAsset}.
     * @param inputs Object for the invoke service to be passed.
     * @Param isAsync If true run the invokable service as async, defaults to False - run as a sync service.
     * @returns The `outputs` and `status`, if the invoke is sync, else for async just return the `jobId`
     */
    public async invoke(assetOrName: string | OperationAsset, inputs?: unknown, isAsync?: boolean): Promise<IInvokeResult> {
        const adapter = RemoteAgentAdapter.getInstance()
        const token = await this.getAuthorizationToken()
        const url = this.getEndpoint('invoke')
        let assetId
        if (typeof assetOrName == 'string') {
            if (isAssetId(assetOrName) || isDID(assetOrName)) {
                assetId = didToAssetId(assetOrName)
            } else {
                const filter = {
                    name: assetOrName,
                    type: 'operation',
                }
                const metaDataList = await this.findAsset(filter)
                if (metaDataList) {
                    assetId = Object.keys(metaDataList)[0]
                }
            }
        } else {
            assetId = assetOrName.getAssetId()
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
            safeJobId = jobId['jobId']
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
