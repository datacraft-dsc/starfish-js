/*

 Main index export of libraries


*/

export { AgentBase } from './Agent/AgentBase'
export { RemoteAgent } from './Agent/RemoteAgent'
export { RemoteAgentAdapter } from './Middleware/RemoteAgentAdapter'

export { AssetBase } from './Asset/AssetBase'
export { BundleAsset } from './Asset/BundleAsset'
export { DataAsset } from './Asset/DataAsset'
export { OperationAsset } from './Asset/OperationAsset'

export { DDO } from './DDO/DDO'

export * from './Interfaces/IMetadata'
export * from './Utils'
export { calculateAssetDataHash, calculateAssetId } from './Crypto'

/*
 *
 *  Ethereum Network
 *
 */
export { EthereumNetwork } from './Network/Ethereum/EthereumNetwork'
export { EthereumAccount } from './Network/Ethereum/EthereumAccount'
export { EthereumContractManager } from './Network/Ethereum/Contract/EthereumContractManager'

export { DirectProvider } from './Network/Ethereum/Provider/DirectProvider'
export { MetamaskProvider } from './Network/Ethereum/Provider/MetamaskProvider'
export { MetamaskProviderWeb } from './Network/Ethereum/Provider/MetamaskProviderWeb'
export { WebSocketProvider } from './Network/Ethereum/Provider/WebSocketProvider'

/*
 *
 *  Convex Network
 *
 */
export { ConvexNetwork } from './Network/Convex/ConvexNetwork'
export { ConvexAccount } from '@convex-dev/convex-api-js'
export { ConvexContractManager } from './Network/Convex/Contract/ConvexContractManager'


