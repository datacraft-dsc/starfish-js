/*

    Helpers for the starfish-js library

*/

import { fromWei, toWei as web3ToWei, toBN, randomHex } from 'web3-utils'

const NETWORK_DID_METHOD = 'dep'

export interface IDIDFragment {
    method: string
    id: string
    path?: string
    fragment?: string
    idHex?: string
}
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

export function didParse(did): IDIDFragment {
    didValidate(did)
    const didRegexp = new RegExp('^did:([a-z0-9]+):([a-f0-9]{64})(.*)', 'i')
    const matchDID = didRegexp.exec(did)
    const result = {
        method: matchDID[1],
        id: matchDID[2],
    }
    result['idHex'] = `0x${result['id']}`
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

export function idToDID(id: string): string {
    const cleanId = removeLeadingHexZero(id)
    return `did:${NETWORK_DID_METHOD}:${cleanId}`
}

export function didToId(did: string): string {
    const result = didParse(did)
    return result['idHex']
}

export function removeLeadingHexZero(text: string): string {
    return text.replace(/^0x/i, '')
}
