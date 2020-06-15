/*


    DDO Class

*/

import { didRandom } from 'starfish/Utils'

import { IDDO, IDDOService } from 'starfish/Interfaces/IDDO'

export class DDO implements IDDO {
    id: string
    '@context': string
    service: Array<IDDOService>

    static supportedServices = {
        meta: {
            type: 'DEP.Meta',
            uri: '/meta',
        },
        storage: {
            type: 'DEP.Storage',
            uri: '/assets',
        },
        invoke: {
            type: 'DEP.Invoke',
            uri: '/invoke',
        },
        market: {
            type: 'DEP.Market',
            uri: '/market',
        },
        trust: {
            type: 'DEP.Trust',
            uri: '/trust',
        },
        auth: {
            type: 'DEP.Auth',
            uri: '/auth',
        },
    }

    static defaultVersion = 'v1'

    public static createFromServiceList(url: string, serviceList: Array<string>, did?: string, version?: string): DDO {
        const ddo = new DDO(did)
        for (const name of serviceList) {
            ddo.addService(name, url, version)
        }
        return ddo
    }

    public static createForAllServices(url: string, did?: string, version?: string): DDO {
        const ddo = new DDO(did)
        for (const name in DDO.supportedServices) {
            ddo.addService(name, url, version)
        }
        return ddo
    }

    public static createFromString(ddoText: string): DDO {
        const data: IDDO = JSON.parse(ddoText)
        return new DDO(data['id'], data['service'])
    }

    public static create(did?: string): DDO {
        return new DDO(did)
    }

    public static isSupportedService(name: string): boolean {
        return name in DDO.supportedServices
    }

    constructor(did: string, service?: Array<IDDOService>) {
        this.service = []
        if (service) {
            this.service = service
        }
        if (did) {
            this.id = <string>did
        } else {
            this.id = didRandom()
        }
        this['@context'] = 'https://www.w3.org/2019/did/v1'
    }

    public addService(name: string, url: string, version?: string): IDDOService {
        if (!version) {
            version = DDO.defaultVersion
        }
        let newService: IDDOService = null
        if (DDO.supportedServices[name]) {
            newService = {
                type: `${DDO.supportedServices[name]['type']}.${version}`,
                serviceEndpoint: `${url}/api/${version}/${DDO.supportedServices[name]['uri']}`,
            }
            const index = this.findServiceIndex(name)
            if (index >= 0) {
                this.service[index] = newService
            } else {
                this.service.push(newService)
            }
        }
        return newService
    }

    public removeService(name: string): boolean {
        let result = false
        const index = this.findServiceIndex(name)
        if (index >= 0) {
            delete this.service[index]
            result = true
        }
        return result
    }

    public findServiceIndex(name: string): number {
        let result = -1
        const nameRegExp = new RegExp(`/.${name}/.`, 'i')
        for (let index = 0; index < this.service.length; index++) {
            if (nameRegExp.test(this.service[index].type)) {
                result = index
                break
            }
        }
        return result
    }

    public findService(name: string): IDDOService {
        const index = this.findServiceIndex(name)
        if (index >= 0) {
            return this.service[index]
        }
        return null
    }

    public toString(): string {
        return JSON.stringify(<IDDO>this)
    }

    public getDID(): string {
        return this.id
    }
    public getServiceList(): Array<IDDOService> {
        return this.service
    }
}
