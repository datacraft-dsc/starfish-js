import Web3 from 'web3'
import ProviderInterface from './Providers/ProviderInterface'
import DirectProvider from './Providers/DirectProvider'

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

    private constructor() {
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
    }

    public getProvider(): ProviderInterface {
        return this.provider
    }
    public getArtifactsPath() {
        return this.artifactsPath
    }
    public getWeb3() {
        return this.web3
    }
    public getNetworkId(): number {
        return this.networkId
    }
}
