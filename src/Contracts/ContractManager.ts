import fs from 'fs-extra'
import Web3 from 'web3'
import IContract from './IContract'


export default class ContractManager {

    private web3: Web3
    private networkName: string
    private artifactsPath: string
    
    public constructor(web3: Web3, networkName: string, artifactsPath: string) {
        this.web3 = web3
        this.networkName = networkName
        this.artifactsPath = artifactsPath
    }
    public load(name: string, artifactFilename?: string, hasArtifact?: boolean): IContract | null {
        if ( !artifactFilename ) {
            artifactFilename = '{name}.{this.networkName}.json'
        }
        let pathFilename = this.findArtifactFile([this.artifactsPath, './'], artifactFilename)
        console.log(pathFilename)
        return null
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
    public findArtifactFile(pathList: Array<string>, filename: string): string | null {
        let path = ''
        for (path in pathList) {
            let pathFilename = path + '/' + filename
            if (fs.pathExists(pathFilename)) {
                return pathFilename
            }
        }
        return null
    }
}
