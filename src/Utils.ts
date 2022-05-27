/*

    Utils for the starfish-js library

*/
import { prefix0x as convexPrefix0x, remove0xPrefix as convexRemove0xPrefix } from '@convex-dev/convex-api-js'

import { IDIDFragment } from './Network/IDIDFragment'
import { randomBytes } from 'crypto'

const NETWORK_DID_METHOD = 'dep'

/*
 *
 *
 *  Contract Helpers
 *
 *
 */

export function testWeb() {
    let value
    if ( window === undefined) {
        value = 'test non browser'
    } else {
        const data = new Uint8Array(32)
        window.crypto.getRandomValues(data)
        value = data.toString()
    }
    return value
}

export function arrayBufferToString(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(data))
}

export function isBalanceInsufficient(balance: BigInt | number | string, amount: BigInt | number | string): boolean {
    const balanceValue = Number(balance)
    const amountValue = Number(amount)
    return balanceValue < amountValue
}

/*
 *
 *
 *      DID Helpers
 *
 *
 */
/**
 * Pre append a 0x prefix to the hex string
 *
 * @param value Value to pe-append 0x too
 * @returns The hex string with a 0x pre appended
 * @category DID Helpers
 */
export function prefix0x(value: string): string {
    return convexPrefix0x(value)
}

/**
 * Remove the leading `0x` from a hex string
 * @param value Hex string to remove the leading 0x.
 * @returns Cleaned up hex string.
 * @category DID Helpers
 */
export function remove0xPrefix(value: string): string {
    return convexRemove0xPrefix(value)
}

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

/**
 * Generate a random DID.
 * @category DID Helpers
 */
export function didRandom(): string {
    return idToDID(randomBytes(32).toString('hex'))
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
    const result = {
        method: matchDID[1],
        id: matchDID[2],
    }
    result['idHex'] = `0x${toIdHex(result['id'])}`
    if (matchDID[3]) {
        result['path'] = matchDID[3]
        const fragmentRegexp = new RegExp('(/[a-f0-9]+)(#.*)', 'i')
        const fragmentMatch = fragmentRegexp.exec(result['path'])
        if (fragmentMatch) {
            result['path'] = fragmentMatch[1]
            result['fragment'] = fragmentMatch[2]
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
    return result['idHex']
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
        id = randomBytes(32).toString('hex')
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
 * Formatting functino to convert an assetId to a hex string.
 * @param assetId Asset id to convert to a hex string.
 * @returns a valid hex string of the assetId.
 * @category DID Helpers
 */
export function toIdHex(assetId: string): string {
    const assetIdRegexp = new RegExp('([a-f0-9]+)$', 'i')
    const match = assetIdRegexp.exec(assetId)
    if (match) {
        return match[1]
    }
    return null
}

/**
 * Parse a full assetDID or just an assetId and return only the assetId. This will be the `path` portion of the DID.
 * @param assetDIDId The asset DID or id to parse.
 * @returns The found assetId from the string.
 * @category DID Helpers
 */
export function extractAssetId(assetDIDId: string): string {
    const assetIdRegexp = new RegExp('^[0-9a-fx]+$', 'i')
    if (assetIdRegexp.test(assetDIDId)) {
        return toIdHex(assetDIDId)
    }
    const result = didParse(assetDIDId)
    if (!result['path']) {
        throw new Error('No asset id in DID path')
    }
    return toIdHex(result['path'])
}

export function isAssetId(assetId: string): boolean {
    const assetIdRegexp = new RegExp('^[0-9a-f]{64}$', 'i')
    return assetIdRegexp.test(remove0xPrefix(assetId))
}
