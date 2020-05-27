import fs from 'fs-extra'
import path from 'path'
import Web3 from 'web3'
import AContract from './AContract'

export default class ContractManager {

    private web3: Web3
    private networkName: string
    private artifactsPath: string
    
    public constructor(web3: Web3, networkName: string, artifactsPath: string) {
        this.web3 = web3
        this.networkName = networkName
        this.artifactsPath = artifactsPath
    }
    public async load(name: string, artifactFilename?: string, hasArtifact?: boolean): Promise<AContract> {
        var contractInstance = null
        if ( !artifactFilename ) {
            artifactFilename = `${name}.${this.networkName}.json`
        }
        let pathFilename = this.findArtifactFile([this.artifactsPath, __dirname], artifactFilename)
        if (pathFilename) {
            
            // import relative to this module
            const contractData = await import(path.join('../../', pathFilename))
            let contractName = `./${name}Contract`
            let contractClass = await import(contractName)
            let constructorName = Object.keys(contractClass)[0]
            contractInstance = new contractClass[constructorName]()
            contractInstance.load(this.web3, contractData.abi, contractData.address)
        }
        return contractInstance
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
        for (let testPath of pathList) {
            let pathFilename = path.join(testPath, filename)
            if (fs.pathExists(pathFilename)) {
                console.log('found file', pathFilename)
                return pathFilename
            }
        }
        return null
    }
}
