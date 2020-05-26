import Web3 from 'web3'
import ContractInterface from './ContractInterface'


export default class ContractManager {

    private web3: Web3
    private networkName: string
    private artifactsPath: string
    
    public constructor(web3: Web3, networkName: string, artifactsPath: string) {
        this.web3 = web3
        this.networkName = networkName
        this.artifactsPath = artifactsPath
    }
    public load(name: string, artifactFilename?: string, hasArtifact?: boolean): ContractInterface {
        if ( !artifactFilename ) {
            artifactFilename = '{name}.{this.networkName}.json'
        }
    }

    public getWeb3(): Web3 {
        return this.web3
    }
    public getNetworkName(): string {
        return this.networkName
    }
    public getArtifactsPath(): string {
        return this.artifactsPath
    }
}
