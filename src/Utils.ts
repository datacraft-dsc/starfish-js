/*

    Utils for the starfish-js library

*/
import { prefix0x as convexPrefix0x, remove0xPrefix as convexRemove0xPrefix } from '@convex-dev/convex-api-js'


/*
 *
 *
 *  Contract Helpers
 *
 *
 */

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
 *      General Helpers
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

export function isAssetId(assetId: string): boolean {
    const assetIdRegexp = new RegExp('^[0-9a-f]{64}$', 'i')
    return assetIdRegexp.test(remove0xPrefix(assetId))
}
