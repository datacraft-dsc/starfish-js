import fs from 'fs-extra'
import path from 'path'
import Web3 from 'web3'
import ContractBase from './ContractBase'

export default class ContractManager {
    readonly web3: Web3
    readonly networkName: string
    readonly artifactsPath: string

    public constructor(web3: Web3, networkName: string, artifactsPath: string) {
        this.web3 = web3
        this.networkName = networkName
        this.artifactsPath = artifactsPath
    }
    public async load(name: string, artifactFilename?: string, hasArtifact?: boolean): Promise<ContractBase> {
        let contractInstance = null
        if (!artifactFilename) {
            artifactFilename = `${name}.${this.networkName}.json`
        }
        const pathFilename = this.findArtifactFile([this.artifactsPath, __dirname], artifactFilename)
        if (pathFilename) {
            // import relative to this module
            const contractData = JSON.parse(await fs.readFile(pathFilename))
            const contractName = `./${name}Contract`
            const contractClass = await import(contractName)
            const constructorName = Object.keys(contractClass)[0]
            contractInstance = new contractClass[constructorName]()
            contractInstance.load(this.web3, contractData.abi, contractData.address)
        }
        return contractInstance
    }
    public findArtifactFile(pathList: Array<string>, filename: string): string | null {
        for (const testPath of pathList) {
            const pathFilename = path.join(testPath, filename)
            if (fs.pathExists(pathFilename)) {
                return pathFilename
            }
        }
        return null
    }
}
