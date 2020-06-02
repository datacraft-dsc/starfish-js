/*

    Helpers for the starfish-js library

*/

import { fromWei, toWei as web3ToWei, toBN } from 'web3-utils'

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
