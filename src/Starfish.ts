import Web3 from 'web3'
import { EventData } from 'web3-eth-contract'

import IProvider from './Providers/IProvider'
import DirectProvider from './Providers/DirectProvider'
import Account from './Account'
import ContractBase from './Contracts/ContractBase'
import ContractManager from './Contracts/ContractManager'
import NetworkContract from './Contracts/NetworkContract'
import OceanTokenContract from './Contracts/OceanTokenContract'
import DispenserContract from './Contracts/DispenserContract'
import DirectPurchaseContract from './Contracts/DirectPurchaseContract'

import { isBalanceInsufficient } from './Helpers'

/**
 * Starfish class to connect to a block chain network. To perform starfish operations
 *
 *
 */
export default class Starfish {
    /**
     * Return a instance of a Starfish object.
     * @param urlProvider URL of the network node or a Provider object to access the node.
     * @param artifactsPath Path to the artifacts files that contain the contract ABI and address.
     * The artifact contract files must be in the format `<contractName>.<networkName>.json`.
     *
     * @return The current Starfish object
     */
    public static async getInstance(urlProvider: string | IProvider, artifactsPath?: string): Promise<Starfish> {
        if (!Starfish.instance) {
            Starfish.instance = new Starfish()
            await Starfish.instance.init(urlProvider, artifactsPath)
        }
        return Starfish.instance
    }

    private static instance
    public provider: IProvider
    public artifactsPath: string
    public web3: Web3
    public networkId: number
    public networkName: string
    protected networkNames: Map<number, string>
    protected contractManager: ContractManager

    constructor() {
        this.networkNames = new Map([
            [0, 'development'],
            [1, 'main'],
            [2, 'morden'],
            [3, 'ropsten'],
            [4, 'rinkeby'],
            [42, 'kovan'],
            [77, 'POA_Sokol'],
            [99, 'POA_Core'],
            [100, 'xDai'],
            [8995, 'nile'], // Ocean Protocol Public test net
            [8996, 'spree'], // Ocean Protocol local test net
            [0xcea11, 'pacific'], // Ocean Protocol Public mainnet
        ])
    }

    /**
     * Initialize the starfish object using a url or Provider and arfitfacts path. It is better
     * to call {@link getInstance} to create a new Starfish object.
     * @param urlProvider URL of the network node or a Provider object to access the node.
     * @param artifactsPath Path to the artifacts files that contain the contract ABI and address.
     */
    public async init(urlProvider: string | IProvider, artifactsPath?: string): Promise<void> {
        if (typeof urlProvider === 'string') {
            this.provider = new DirectProvider(urlProvider)
        } else {
            this.provider = urlProvider
        }
        if (artifactsPath === undefined) {
            artifactsPath = 'artifacts'
        }
        this.artifactsPath = artifactsPath
        await this.connect()
    }

    /**
     * Connect to the network node.
     * @returns True if the connection is successfull.
     */
    public async connect(): Promise<boolean> {
        this.web3 = new Web3(Web3.givenProvider || this.provider.getProvider())
        this.networkId = await this.web3.eth.net.getId()
        this.networkName = this.networkNames.get(this.networkId)
        return true
    }

    /**
     * Load a contract based on it's name.
     * @param name Name of the contract to load
     * @returns AContract that has been loadad
     */
    public async getContract(name: string): Promise<ContractBase> {
        if (!this.contractManager) {
            this.contractManager = new ContractManager(this.web3, this.networkName, this.artifactsPath)
        }
        return this.contractManager.load(name)
    }

    /*
     *
     *      Account base operations
     *
     *
     */

    /**
     * Return the ether balance for a given account or account address.
     * @param accountAddress Acount object on account address string.
     * @returns Ether balance as a string.
     */
    public async getEtherBalance(accountAddress: Account | string): Promise<string> {
        const contract = new NetworkContract()
        contract.load(this.web3)
        return await contract.getBalance(accountAddress)
    }

    /**
     * Return the token balance for a given account or account address.
     * @param accountAddress Acount object on account address string.
     * @returns Token balance as a string.
     */
    public async getTokenBalance(accountAddress: Account | string): Promise<string> {
        const contract = <OceanTokenContract>await this.getContract('OceanToken')
        return await contract.getBalance(accountAddress)
    }

    /**
     * Request more tokens, this only works on a test network ONLY.
     * @param account Account object to request tokens for.
     * @param amount Amount to request.
     * @returns True if successfull.
     */
    public async requestTestTokens(account: Account, amount: number): Promise<boolean> {
        const contract = <DispenserContract>await this.getContract('Dispenser')
        const receipt = await contract.requestTokens(account, amount)
        return receipt.status
    }

    /*
     *
     *      Send ether and tokens to another account
     *
     *
     */
    /**
     * Send some ether to another account.
     * @param account Account to send the ether from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress Account or address string of the account that will receive the payment.
     * @param amount Amount to of ether to send.
     * @returns True if the sending of the payment was made.
     */
    public async sendEther(account: Account, toAccountAddress: Account | string, amount: number | string): Promise<boolean> {
        const contract = new NetworkContract()
        contract.load(this.web3)
        const fromAccountBalance = await contract.getBalance(account)

        if (isBalanceInsufficient(fromAccountBalance, amount)) {
            throw new Error(
                `The account ${account.address} has insufficient funds of ${fromAccountBalance} ether to send ${amount} ether`
            )
        }
        const receipt = await contract.sendEther(account, toAccountAddress, amount)
        return receipt.status
    }

    /**
     * Send some token to another account.
     * @param account Account to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress Account or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @returns True if the sending of the payment was made.
     */
    public async sendToken(account: Account, toAccountAddress: Account | string, amount: number | string): Promise<boolean> {
        const contract = <OceanTokenContract>await this.getContract('OceanToken')
        const fromAccountBalance = await contract.getBalance(account)

        if (isBalanceInsufficient(fromAccountBalance, amount)) {
            throw new Error(
                `The account ${account.address} has insufficient funds of ${fromAccountBalance} tokens to send ${amount} tokens`
            )
        }
        const receipt = await contract.transfer(account, toAccountAddress, amount)
        return receipt.status
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
     * @param account Account to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress Account or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns True if the sending of the payment was made.
     */
    public async sendTokenWithLog(
        account: Account,
        toAccountAddress: Account | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<boolean> {
        let status = false
        const oceanContract = <OceanTokenContract>await this.getContract('OceanToken')
        const directContract = <DirectPurchaseContract>await this.getContract('DirectPurchase')

        const fromAccountBalance = await oceanContract.getBalance(account)
        if (isBalanceInsufficient(fromAccountBalance, amount)) {
            throw new Error(
                `The account ${account.address} has insufficient funds of ${fromAccountBalance} tokens to send ${amount} tokens`
            )
        }

        // first approve the transfer fo tokens for the direct-contract
        const approved = await oceanContract.approveTransfer(account, directContract.address, amount)
        status = approved.status
        if (status) {
            const receipt = await directContract.sendTokenWithLog(account, toAccountAddress, amount, reference1, reference2)
            status = receipt.status
        }
        return status
    }
    /**
     * Returns true if any token has been sent to the recipient 'toAccountAddress' with the amount, and optiona references.
     * @param account Account to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress Account or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns True if a valid payment was found.
     */
    public async isTokenSent(
        fromAccountAddress: Account | string,
        toAccountAddress: Account | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<boolean> {
        const contract = <DirectPurchaseContract>await this.getContract('DirectPurchase')
        const eventLogs = await contract.getEventLogs(fromAccountAddress, toAccountAddress, amount, reference1, reference2)
        return eventLogs && eventLogs.length > 0
    }
    /**
     * Returns a list of events that have been sent to the recipient 'toAccountAddress' with the amount, and optiona references.
     * @param account Account to send the token from. You must have access to the private password, or have this account unlocked.
     * @param toAccountAddress Account or address string of the account that will receive the payment.
     * @param amount Amount to of token to send.
     * @param reference1 Reference #1 to save with the payment transaction.
     * @param reference2 Reference #2 to save with the payment transaction.
     * @returns The list of events that have been found.
     */

    public async getTokenEventLogs(
        fromAccountAddress: Account | string,
        toAccountAddress: Account | string,
        amount: number | string,
        reference1?: string,
        reference2?: string
    ): Promise<EventData[]> {
        const contract = <DirectPurchaseContract>await this.getContract('DirectPurchase')
        return contract.getEventLogs(fromAccountAddress, toAccountAddress, amount, reference1, reference2)
    }
}
