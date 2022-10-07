/*

    DID helper function for the starfish-js library

*/
import { prefix0x as convexPrefix0x, remove0xPrefix as convexRemove0xPrefix } from '@convex-dev/convex-api-js'
import { toIdHex, isAssetId } from './Utils'

import { IDIDFragment } from './IDIDFragment'
import cryptojs from 'crypto-js'

const NETWORK_DID_METHOD = 'dep'

/*
 *
 *
 *      DID Helpers
 *
 *
 */

/**
 * Validates a DID.
 * The following validation has to be met:
 *
 * 1. The string must start with `did:`.
 * 2. The operation name must be all a-z 0-9 chars.
 * 2. The id part must be a 64 char hex number.
 *
 * @param did DID string to validate.
 * @returns true if the did string is a valid did.
 * @category DID Helpers
 */
export function didValidate(did: string): boolean {
    const didHeader = new RegExp('^did:')
    if (!didHeader.test(did)) {
        throw new Error(`DID ${did} must start with "did"`)
    }
    const didMethod = new RegExp('^did:[a-z0-9]+:.*', 'i')
    if (!didMethod.test(did)) {
        throw new Error(`DID ${did} method name must have only a-z, A-Z and 0-9 characters`)
    }

    const didPath = new RegExp('^did:[a-z0-9]+:[a-f0-9]{64}/?.*', 'i')
    if (!didPath.test(did)) {
        throw new Error(`DID ${did} path should only have 64 HEX characters`)
    }
    return true
}

/**
 * Simple check to see if the string is a valid DID, return no errors other than True or False.
 * @param did DID string to check.
 * @returns true if it is a valid DID, else false.
 * @category DID Helpers
 */
export function isDID(did: string): boolean {
    try {
        return didValidate(did)
    } catch (err) {
        return false
    }
    return false
}

export function isAssetDID(did: string): boolean {
    let didFragment
    try {
        didFragment = didParse(did)
    } catch (err) {
        return false
    }
    return isAssetId(toIdHex(didFragment.path))
}

/**
 * Generate a random DID.
 * @category DID Helpers
 */
export function didRandom(): string {
    return idToDID(cryptojs.lib.WordArray.random(32).toString())
}

/**
 * Parse a DID and return it's component parts as a IDIDFragment.
 * The following is parsed:
 *
 * ```
 * did:<method>:<id|idHex>[/<path>[#<fragment>]]
 *
 * ```
 *
 * @param did DID string to parse.
 * @returns a IDIDFragment
 * @category DID Helpers
 */
export function didParse(did: string): IDIDFragment {
    didValidate(did)
    const didRegexp = new RegExp('^did:([a-z0-9]+):([a-f0-9]{64})(.*)', 'i')
    const matchDID = didRegexp.exec(did)
    const result: IDIDFragment = {
        method: matchDID[1],
        id: matchDID[2],
    }
    if (matchDID[3] && matchDID[3][0] === '/') {
        result.path = matchDID[3].substr(1)
        const fragmentRegexp = new RegExp('([a-f0-9]+)(#.*)', 'i')
        const fragmentMatch = fragmentRegexp.exec(result.path)
        if (fragmentMatch) {
            result.path = fragmentMatch[1]
            result.fragment = fragmentMatch[2]
        }
    }
    return result
}

/**
 * Converts a hex id to DID.
 * @param id Hex string to convert.
 * @returns DID of the hex string
 * @category DID Helpers
 */
export function idToDID(id: string): string {
    const cleanId = convexRemove0xPrefix(id)
    return `did:${NETWORK_DID_METHOD}:${cleanId}`
}

/**
 * Converts the DID to an hex id string.
 * @param did DID string to convert.
 * @returns id hex string
 * @category DID Helpers
 */
export function didToId(did: string): string {
    const result = didParse(did)
    return convexPrefix0x(toIdHex(result['id']))
}

/**
 * Create a DID using it's component parts.
 * @param id Id of the DID , if not given generate a random hex string (64 chars).
 * @param assetId Asset Id of the path, if null then no path
 * @param fragment Fragment to append to the path.
 * @returns a valid DID string
 * @category DID Helpers
 */
export function didCreate(id?: string, assetId?: string, fragment?: string): string {
    if (!id) {
        id = cryptojs.lib.WordArray.random(32).toString()
    }
    let did = idToDID(id)
    if (assetId) {
        did = did + '/' + convexRemove0xPrefix(assetId)
    }
    if (fragment) {
        did = did + `#${fragment}`
    }
    return did
}

/**
 * Parse a full assetDID or just an assetId and return only the assetId. This will be the `path` portion of the DID.
 * @param assetDIDId The asset DID or id to parse.
 * @returns The found assetId from the string.
 * @category DID Helpers
 */
export function didToAssetId(assetDID: string): string {
    const assetIdRegexp = new RegExp('^[0-9a-fx]+$', 'i')
    if (assetIdRegexp.test(assetDID)) {
        return toIdHex(assetDID)
    }
    const result = didParse(assetDID)
    if (!result['path']) {
        throw new Error('No asset id in DID path')
    }
    return toIdHex(result['path'])
}
