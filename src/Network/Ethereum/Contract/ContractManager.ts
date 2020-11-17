import fs from 'fs'
import path from 'path'
import Web3 from 'web3'
import fetch from 'node-fetch'

import { ContractBase } from './ContractBase'
import { IArtifactsPackage, IArtifact } from '../../../Interfaces/IArtifactsPackage'

export class ContractManager {
    readonly web3: Web3
    readonly networkName: string
    readonly networkId: number
    public artifactsPackage: IArtifactsPackage

    public constructor(web3: Web3, networkId: number, networkName: string) {
        this.web3 = web3
        this.networkId = networkId
        this.networkName = networkName
    }
    public async load(name: string, artifactsPath?: string, artifactFilename?: string): Promise<ContractBase> {
        let contractInstance = null

        // first search for contract artifact in the path/filename
        let artifactData = await this.loadArtifactFromFile(name, artifactsPath, artifactFilename)

        // not found in the
        if (!artifactData) {
            artifactData = this.loadArtifactFromPackage(name)
        }
        if (artifactData) {
            const contractName = `./${name}Contract`
            const contractClass = await import(contractName)
            const constructorName = Object.keys(contractClass)[0]
            contractInstance = new contractClass[constructorName]()
            contractInstance.load(this.web3, artifactData.abi, artifactData.address)
        } else {
            throw new Error(`Cannot find any artifact data for the contract ${name}`)
        }
        return contractInstance
    }

    public async loadArtifactFromFile(name: string, path?: string, filename?: string): Promise<IArtifact> {
        path = path ? path : 'artifacts'

        let artifactFilename = filename
        if (!artifactFilename) {
            artifactFilename = `${name}.${this.networkId}.json`
        }
        const pathFilename = this.findArtifactFile([path, __dirname], artifactFilename)
        if (pathFilename) {
            // import relative to this module
            const artifactRawData = await fs.promises.readFile(pathFilename)
            return JSON.parse(artifactRawData.toString('utf-8'))
        }
    }

    public loadArtifactFromPackage(name: string): IArtifact {
        if (
            this.artifactsPackage &&
            this.artifactsPackage.artifacts &&
            this.artifactsPackage.artifacts[this.networkId] &&
            this.artifactsPackage.artifacts[this.networkId][name]
        ) {
            return this.artifactsPackage.artifacts[this.networkId][name]
        }
    }

    public async loadLocalArtifactsPackage(timeoutSeconds?: number, url?: string): Promise<void> {
        let data = await ContractManager.requestLocalArtifactsPackage(url)
        let counter = timeoutSeconds ? timeoutSeconds : 20
        const requestDataTimeout = setInterval(async () => {
            data = await ContractManager.requestLocalArtifactsPackage(url)
            counter--
            if (data || counter < 0) {
                clearInterval(requestDataTimeout)
            }
        }, 1000)
        if (data && data.version) {
            this.artifactsPackage = data
        }
    }

    public findArtifactFile(pathList: Array<string>, filename: string): string | null {
        for (const testPath of pathList) {
            const pathFilename = path.join(testPath, filename)
            if (fs.existsSync(pathFilename)) {
                return pathFilename
            }
        }
        return null
    }

    public static async requestLocalArtifactsPackage(url?: string): Promise<IArtifactsPackage> {
        if (!url) {
            url = 'http://localhost:8550/artifacts'
        }
        const response = await fetch(url, {
            method: 'GET',
        })
        if (!response.ok) {
            throw new Error(`Unable to get any artifacts from local contract package server ${response}`)
        }
        return response.json()
    }
}
