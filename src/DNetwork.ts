import Web3 from 'web3'

export default class DNetwork {

    public static async getInstance(url: string, artifactsPath?: string): Promise<DNetwork> {
        if (!DNetwork.instance) {
            DNetwork.instance = new DNetwork()
            await DNetwork.instance.init(url, artifactsPath)
        }
        return DNetwork.instance
    }

    private static instance
    private url: string
    private artifactsPath: string
    private web3: Web3
    private networkId: number

    private constructor() {
    }

    public async init(url: string, artifactsPath?: string) {
        this.url = url
        if (artifactsPath === undefined) {
            artifactsPath = 'artifacts'
        }
        this.artifactsPath = artifactsPath
        this.connect()
        
    }

    public async connect() {
        this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(this.url))
        this.networkId = await this.web3.eth.net.getId()
        console.log('networkId', this.networkId)
        
    }
    public getUrl() {
        return this.url
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
