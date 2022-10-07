import { API as ConvexAPI, Account as ConvexAccount } from '@convex-dev/convex-api-js'
import { isDID, didToId } from '../../DID'
import { isBalanceInsufficient } from '../../Utils'
import { ContractBase, ConvexContractManager, DIDRegistryContract, ProvenanceContract } from './Contract/Contract'
// import { DDO } from '../../DDO/DDO'
import { RemoteAgent } from '../../Agent/RemoteAgent'
import { IAgentAuthentication } from '../../Agent/IAgentAuthentication'
import { IProvenanceData, IProvenanceDataList, IProvenanceOwnerList } from './Contract/IProvenance'

const DID_REGISTRY_CONTRACT_NAME = 'starfish.did'
const PROVENANCE_CONTRACT_NAME = 'starfish.provenance'
/**
 *
 * ConvexNetwork class to connect to the Convex.world network. To perform starfish operations
 *
 *
 */
export class ConvexNetwork {
    /**
     * Return a instance of a EthereumNetwork object.
     * @param url URL of the convex network.
     *
     * @return The current ConvexNetwork object
     * @category Static Create
     */
    public static async getInstance(url: string): Promise<ConvexNetwork> {
        if (!ConvexNetwork.instance) {
            ConvexNetwork.instance = new ConvexNetwork()
        }
        await ConvexNetwork.instance.init(url)
        return ConvexNetwork.instance
    }

    private static instance
    protected contractManager: ConvexContractManager
    readonly queryAddress: BigInt
    public url: string
    public convex: ConvexAPI

    constructor() {
        this.queryAddress = BigInt(1)
    }
    /**
     * Initialize the starfish object using a url or Provider and arfitfacts path. It is better
     * to call {@link getInstance} to create a new EthereumNetwork object.
     * @param url URL of the network.
     * @param artifactsPath Path to the artifacts files that contain the contract ABI and address.
     */
    public async init(url: string): Promise<void> {
        this.url = url
        this.convex = new ConvexAPI(this.url)
        this.contractManager = new ConvexContractManager(this.convex)
    }

    /**
     * Load a contract based on it's name.
     * @param name Name of the contract to load
     * @returns AContract that has been loadad
     */
    public async loadContract(name: string, registerName: string): Promise<ContractBase> {
        return this.contractManager.load(name, registerName)
    }

    /*
     *
     *      Account base operations
     *
     *
     */

    /**
     * Return the token balance for a given account or account address.
     * @param accountAddress Acount object on account address string.
     * @returns Token balance as a string.
     */
    public async getTokenBalance(accountAddress: ConvexAccount | BigInt): Promise<BigInt> {
        return await this.convex.getBalance(accountAddress)
    }

    /**
     * Request more tokens, this only works on a test network ONLY.
     * @param account ConvexAccount object to request tokens for.
     * @param amount Amount to request.
     * @returns True if successfull.
     */
    public async requestTestTokens(account: ConvexAccount, amount: BigInt): Promise<BigInt> {
        return await this.convex.requestFunds(amount, account)
    }

    /*
     *
     *      Send ether and tokens to another account
     *
     *
     */

    /**
     * Send some token to another account.
     * @param account ConvexAccount to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress ConvexAccount or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @returns True if the sending of the payment was made.
     */
    public async sendToken(account: ConvexAccount, toAccountAddress: ConvexAccount | BigInt, amount: BigInt): Promise<BigInt> {
        const fromAccountBalance = await this.convex.getBalance(account)

        if (isBalanceInsufficient(fromAccountBalance, amount)) {
            throw new Error(
                `The account ${account.address} has insufficient funds of ${fromAccountBalance} tokens to send ${amount} tokens`
            )
        }
        return await this.convex.transfer(toAccountAddress, amount, account)
    }

    /*
     *
     *
     *      Send Tokens (make payment) with logging on the block chain.
     *
     */

    /**
     * Send some token to another account and record the transaction with two optional references. These references are saved
     * on the block chain with the payment transaction. They can be reterived later using the call {@link getTokenEventLogs}
     * @param account ConvexAccount to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress ConvexAccount or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns True if the sending of the payment was made.
     */
    /*
    public async sendTokenWithLog(
        account: ConvexAccount,
        toAccountAddress: ConvexAccount | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<boolean> {
        let status = false
        const datacraftContract = <DatacraftTokenContract>await this.getContract('DatacraftToken')
        const directContract = <DirectPurchaseContract>await this.getContract('DirectPurchase')

        const fromAccountBalance = await datacraftContract.getBalance(account)
        if (isBalanceInsufficient(fromAccountBalance, amount)) {
            throw new Error(
                `The account ${account.address} has insufficient funds of ${fromAccountBalance} tokens to send ${amount} tokens`
            )
        }

        // first approve the transfer fo tokens for the direct-contract
        const approved = await datacraftContract.approveTransfer(account, directContract.address, amount)
        status = approved.status
        if (status) {
            const receipt = await directContract.sendTokenWithLog(account, toAccountAddress, amount, reference1, reference2)
            status = receipt.status
        }
        return status
    }
*/
    /**
     * Returns true if any token has been sent to the recipient 'toAccountAddress' with the amount, and optional references.
     * This method will only show any tokens sent by the method {@link sendTokenWithLog}.
     * @param account ConvexAccount to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress ConvexAccount or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns True if a valid payment was found.
     */
    /*
    public async isTokenSent(
        fromAccountAddress: ConvexAccount | string,
        toAccountAddress: ConvexAccount | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<boolean> {
        const contract = <DirectPurchaseContract>await this.getContract('DirectPurchase')
        const eventLogs = await contract.getEventLogs(fromAccountAddress, toAccountAddress, amount, reference1, reference2)
        return eventLogs && eventLogs.length > 0
    }
*/
    /**
     * Returns a list of events that have been sent to the recipient 'toAccountAddress' with the amount, and optiona references.
     * This call will only work with tokens send by the method {@link sendTokenWithLog}.
     * @param account ConvexAccount to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress ConvexAccount or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns The list of events that have been found.
     */
    /*
    public async getTokenEventLogs(
        fromAccountAddress: ConvexAccount | string,
        toAccountAddress: ConvexAccount | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<EventData[]> {
        const contract = <DirectPurchaseContract>await this.getContract('DirectPurchase')
        return contract.getEventLogs(fromAccountAddress, toAccountAddress, amount, reference1, reference2)
    }
*/
    /*
     *
     *
     *      Register and list Provenance
     *
     *
     *
     */
    /**
     * Register provenance on the network.
     * @param account ConvexAccount to register the provenance from.
     * @param assetId Asset id to register. This is a 32 byte hex string ( '0x' + 64 hex chars )
     * @returns True if the registration was successfull.
     */
    public async registerProvenance(account: ConvexAccount, assetDID: string, data: string): Promise<IProvenanceData> {
        const contract = <ProvenanceContract>await this.loadContract('Provenance', PROVENANCE_CONTRACT_NAME)
        return await contract.register(assetDID, data, account)
    }

    /**
     * Return a list of provenance event logs for a given assetId.
     * @param assetId Asset id to search for a provenance record.
     * @returns List of event items found for this assetId.
     */
    public async getProvenance(assetDID: string): Promise<IProvenanceData> {
        const contract = <ProvenanceContract>await this.loadContract('Provenance', PROVENANCE_CONTRACT_NAME)
        return await contract.getData(assetDID)
    }

    public async getProvenanceDIDList(didId: string): Promise<IProvenanceDataList> {
        const contract = <ProvenanceContract>await this.loadContract('Provenance', PROVENANCE_CONTRACT_NAME)
        return await contract.getDIDList(didId)
    }

    public async getProvenanceOwnerList(account: ConvexAccount | BigInt | number | string): Promise<IProvenanceOwnerList> {
        const contract = <ProvenanceContract>await this.loadContract('Provenance', PROVENANCE_CONTRACT_NAME)
        return await contract.getOwnerList(account)
    }
    /*
     *
     *
     *      Register DID with a DDO string and reslove DID to a DDO string
     *
     *
     */
    /*
     * Registers a DID on the block chain network, with an associated DDO.
     * @param account ConvexAccount to use to sign and pay for the registration.
     * @param did DID string to register.
     * @param ddoText DDO in JSON text.
     * @returns True if the registration was successful.
     */

    public async registerDID(account: ConvexAccount, did: string, ddoText: string): Promise<string> {
        const contract = <DIDRegistryContract>await this.loadContract('DIDRegistry', DID_REGISTRY_CONTRACT_NAME)
        const didId = didToId(did)
        const result = await contract.register(account, didId, ddoText)
        return result
    }

    /*
     * Resolves a DID to a DDO text string if found on the block chain network.
     * @param did DID to search find.
     * @returns DDO as a JSON text if found, else return null.
     */

    public async resolveDID(did: string, account: ConvexAccount | BigInt | number | string): Promise<string> {
        const contract = <DIDRegistryContract>await this.loadContract('DIDRegistry', DID_REGISTRY_CONTRACT_NAME)
        const didId = didToId(did)
        return contract.resolve(didId, account)
    }

    /*
     *
     *
     *          Helper for resolving agents
     *
     *
     */

    /*
     * Resolves an agent address to a DDO object. An agent address can be a URL, DID or Asset DID.
     * @param agentAddress DID, URL or Asset DID of the agent to resolve.
     * @param username Optional username of the agent to access. Access is only used if the URL is provided.
     * @param password Optional password of the agent to access.
     * @param authentication Optionas authentication object, this can be used instead of the username/password
     * @returns a DDO object if the agent is found, else returns null.
     */

    public async resolveAgent(
        agentAddress: string,
        username?: string,
        password?: string,
        authentication?: IAgentAuthentication
    ): Promise<string> {
        if (isDID(agentAddress)) {
            const ddoText = await this.resolveDID(agentAddress, this.queryAddress)
            if (ddoText) {
                return ddoText
            }
        }
        let agentAuthentication = authentication
        if (!authentication) {
            agentAuthentication = {
                username: username,
                password: password,
            }
        }
        const ddoText = await RemoteAgent.resolveURL(agentAddress, agentAuthentication)
        if (ddoText) {
            return ddoText
        }
        return null
    }

    public async resolveAgentDID(did: string): Promise<string> {
        if (isDID(did)) {
            const ddoText = await this.resolveDID(did, this.queryAddress)
            if (ddoText) {
                return ddoText
            }
        }
        return null
    }
}
