/*
 *
 *
 *      DDO Interface
 *
 *
 */

export interface IDDOService {
    public type: string
    public serviceEndpoint: string
}

export interface IDDO {
    public id: string
    public '@context': string
    public service: Array<IDDOService>
}
