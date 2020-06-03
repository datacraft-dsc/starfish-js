/*

    Helpers for the starfish-js library

*/

import { fromWei, toWei as web3ToWei, toBN, randomHex } from 'web3-utils'

const NETWORK_DID_METHOD = 'dep'

/*
 *
 *
 *  Contract Helpers
 *
 *
 */
export function toEther(amountWei: string): string {
    return fromWei(amountWei, 'ether')
}
export function toWei(amountEther: number | string): string {
    return web3ToWei(String(amountEther))
}

export function isBalanceInsufficient(balanceEther: number | string, amount: number | string): boolean {
    const balanceWei = toBN(toWei(balanceEther))
    const amountWei = toBN(toWei(amount))
    return balanceWei.lt(amountWei)
}

/*
 *
 *
 *      DID Helpers
 *
 *
 */

export function didValidate(did: string): boolean {
    const didHeader = new RegExp('^did:')
    if (!didHeader.test(did)) {
        throw new Error(`DID ${did} must start with "did"`)
    }
    const didMethod = new RegExp('^did:[a-zA-Z0-9]+:.*')
    if (!didMethod.test(did)) {
        throw new Error(`DID ${did} method name must have only a-z, A-Z and 0-9 characters`)
    }

    const didPath = new RegExp('^did:[a-zA-Z0-9]+:[a-fA-F0-9]{64}.*')
    if (!didPath.test(did)) {
        throw new Error(`DID ${did} path should only have 64 HEX characters`)
    }
    return true
}

export function isDID(did: string): boolean {
    try {
        return didValidate(did)
    } catch (err) {
        return false
    }
    return false
}

export function didGenerateRandom(): string {
    return idToDID(randomHex(32))
}

export function idToDID(id: string): string {
    const cleanId = removeLeadingHexZero(id)
    return `did:${NETWORK_DID_METHOD}:${cleanId}`
}

export function removeLeadingHexZero(text: string): string {
    return text.replace(/^0x/i, '')
}
