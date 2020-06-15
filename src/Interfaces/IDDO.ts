/*
 *
 *
 *      DDO Interface
 *
 *
 */

export interface IDDOService {
    type: string
    serviceEndpoint: string
}

export interface IDDO {
    id: string
    '@context': string
    service: Array<IDDOService>
}
