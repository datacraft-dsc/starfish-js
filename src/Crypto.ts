/*
 *
 *     Crypto utils
 *
 *
 */
import cryptojs from 'crypto-js'
import { sha3_256 } from 'js-sha3'
import { convertWordArrayToByteArray } from '@convex-dev/convex-api-js'

/**
 * Caluclate the assetId based on the metadata text. At the moment no validation is done on the text.
 * @param metadataText text to calculate the hash on.
 * @returns SHA-256 of the metadata text as hex string.
 */
export function calculateAssetId(metadataText: string): string {
    return sha3_256(metadataText)
}

/**
 * Calculate the content hash of any asset data.
 * @param data Data to calculate the hash.
 * @returns the SHA-256 hash of the data as hex string.
 */
export function calculateAssetDataHash(data: ArrayBuffer): string {
    return sha3_256(data)
}

export function randomBytes(length: number): Uint8Array {
    const data = cryptojs.lib.WordArray.random(length)
    return convertWordArrayToByteArray(data)
}
