import Web3 from 'web3'
import ProviderInterface from './Providers/ProviderInterface'
import DirectProvider from './Providers/DirectProvider'
import ContractInterface from './Contracts/ContractInterface'
import ContractManager from './Contracts/ContractManager'


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

    public getContract(name: string): ContractInterface {
        if ( ! this.contractManager ) {
            this.contractManager = new ContractManager(this.web3, this.networkName, this.artifactsPath)
        }
        return this.contractManager.load(name)
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
