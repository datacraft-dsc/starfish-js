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
    info: any
    utime: string
}

export interface IListingRequestData {
    assetid: string
    info: any
}

export interface IListingFilter {
    username?: string
    userid?: string
    from?: number
    size?: number
}
