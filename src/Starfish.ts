import Web3 from 'web3'
import ProviderInterface from './Providers/ProviderInterface'
import DirectProvider from './Providers/DirectProvider'
import Account from './Account'
import AContract from './Contracts/AContract'
import ContractManager from './Contracts/ContractManager'
import NetworkContract from './Contracts/NetworkContract'
import OceanTokenContract from './Contracts/OceanTokenContract'
import DispenserContract from './Contracts/DispenserContract'

export default class Starfish {

    public static async getInstance(urlProvider: string | ProviderInterface, artifactsPath?: string): Promise<Starfish> {
        if (!Starfish.instance) {
            Starfish.instance = new Starfish()
            await Starfish.instance.init(urlProvider, artifactsPath)
        }
        return Starfish.instance
    }

    private static instance
    private provider: any
    private artifactsPath: string
    private web3: Web3
    private networkId: number
    private networkName: string
    protected networkNames: Map<number, string>
    protected contractManager: ContractManager


    private constructor() {
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
            [8995, 'nile'],                   // Ocean Protocol Public test net
            [8996, 'spree'],                  // Ocean Protocol local test net
            [0xcea11, 'pacific']              // Ocean Protocol Public mainnet
        ])
    }

    public async init(urlProvider: string | ProviderInterface, artifactsPath?: string) {

        if ( Web3.givenProvider) {
            this.provider = Web3.givenProvider
        }
        else {
            if (typeof urlProvider === 'string') {
                this.provider = new DirectProvider(urlProvider).getProvider()
            }
            else {
                this.provider = urlProvider.getProvider();
            }
        }

        if (artifactsPath === undefined) {
            artifactsPath = 'artifacts'
        }
        this.artifactsPath = artifactsPath
        await this.connect()

    }

    public async connect() {
        this.web3 = new Web3(this.provider)
        this.networkId = await this.web3.eth.net.getId()
        this.networkName = this.networkNames.get(this.networkId)
    }

    public async getContract(name: string): Promise<AContract> {
        if ( ! this.contractManager ) {
            this.contractManager = new ContractManager(this.web3, this.networkName, this.artifactsPath)
        }
        return await this.contractManager.load(name)
    }

    /*
     *
     *      Account base operations
     *
     *
     */

    public async getEtherBalance(accountAddress: Account | string): Promise<string> {
        let contract = new NetworkContract()
        contract.load(this.web3)
        return await contract.getBalance(accountAddress)
    }

    public async getTokenBalance(accountAddress: Account | string): Promise<string> {
        let contract = <OceanTokenContract> await this.getContract('OceanToken')
        return await contract.getBalance(accountAddress)
    }

    public async requestTestTokens(account: Account, amount: number): Promise<boolean> {
        let contract = <DispenserContract> await this.getContract('Dispenser')
        let txHash = await contract.requestTokens(account, amount)
        let receipt = await contract.waitForReceipt(txHash)
        return receipt.status === 1
    }

    public getProvider(): ProviderInterface {
        return this.provider
    }
    public getArtifactsPath(): string {
        return this.artifactsPath
    }
    public getWeb3(): Web3 {
        return this.web3
    }
    public getNetworkId(): number {
        return this.networkId
    }
    public getNetworkName(): string {
        return this.networkName
    }
}
