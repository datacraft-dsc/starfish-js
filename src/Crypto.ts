/*
 *
 *     Crypto utils
 *
 *
 */


import crypto from 'crypto'

export function calcAssetId(metadataText: string): string {
    return crypto.createHash('SHA3-256').update(metadataText).digest('hex')
}

export function calcAssetDataHash(buffer: Buffer): string {
    return crypto.createHash('SHA3-256').update(buffer).digest('hex')
}
