/*
 *
 *
 *
 *      Artifacts Package Interface
 *
 *
 *
 */

export interface IArtifact {
    name: string
    abi: unknown
    address: string
}

export interface IArtifactContracts {
    [name: string]: IArtifact
}
export interface IArtifactNetworks {
    [networkId: number]: IArtifactContracts
}

export interface IArtifactsPackage {
    version: string
    artifacts: IArtifactNetworks
}
