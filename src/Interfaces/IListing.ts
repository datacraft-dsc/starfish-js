/*
 *
 *
 *      Listing Interfaces
 *
 *
 */

export interface IListingData {
    trust_level: number
    userid: string
    assetid: string
    agreement?: string
    ctime: string
    status: string
    id: string
    info: unknown
    utime: string
}

export interface IListingRequestData {
    assetid: string
    info: unknown
}

export interface IListingFilter {
    username?: string
    userid?: string
    from?: string
    size?: string
    [x: string]: string
}
