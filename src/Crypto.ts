/*
 *
 *     Crypto utils
 *
 *
 */

// import { SHA3 } from 'sha3'

/**
 * Caluclate the assetId based on the metadata text. At the moment no validation is done on the text.
 * @param metadataText text to calculate the hash on.
 * @returns SHA-256 of the metadata text as hex string.
 */
/*
export function calculateAssetId(metadataText: string): string {
    return new SHA3(256).update(metadataText).digest('hex')
}
*/
/**
 * Calculate the content hash of any asset data.
 * @param buffer Data to calculate the hash.
 * @returns the SHA-256 hash of the data as hex string.
 */
/*
export function calculateAssetDataHash(buffer: ArrayBuffer): string {
    return new SHA3(256).update(buffer).digest('hex')
}
*/

/*
 *
 *     Crypto utils
 *
 *
 */

import crypto from 'crypto'

/**
 * Caluclate the assetId based on the metadata text. At the moment no validation is done on the text.
 * @param metadataText text to calculate the hash on.
 * @returns SHA-256 of the metadata text as hex string.
 */
export function calculateAssetId(metadataText: string): string {
    return crypto.createHash('SHA3-256').update(metadataText).digest('hex')
}

/**
 * Calculate the content hash of any asset data.
 * @param buffer Data to calculate the hash.
 * @returns the SHA-256 hash of the data as hex string.
 */
export function calculateAssetDataHash(buffer: ArrayBuffer): string {
    return crypto.createHash('SHA3-256').update(Buffer.from(buffer)).digest('hex')
}
