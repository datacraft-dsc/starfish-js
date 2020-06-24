/*


    DDO Class

*/

import { didRandom } from '../Utils'

import { IDDO, IDDOService } from '../Interfaces/IDDO'

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

    /**
     * @param url Base url for all of the services. e.g. 'https://my-agent'
     * @param serviceList Array of string list of service names to include:
     *   they can be meta, storage, invoke, market, trust, auth
     * @param did DID string that has been assigned to this agent
     * @param version Optional version number, Defaults: v1.
     *   API services will be created using the following format:
     *      <URL>/api/<version>/<service_uri>
     *
     * @returns a DDO object with the correct information set.
     * @category Static Create
     */
    public static createFromServiceList(url: string, serviceList: Array<string>, did?: string, version?: string): DDO {
        const ddo = new DDO(did)
        for (const name of serviceList) {
            ddo.addService(name, url, version)
        }
        return ddo
    }

    /**
     * Create a DDO for all services
     * @param url  Base url for all of the services. e.g. 'https://my-agent'
     * @param did DID string that has been assigned to this agent
     * @param version Optional version number, Defaults: v1.
     * @returns a DDO object with the correct information set.
     * @category Static Create
     */
    public static createForAllServices(url: string, did?: string, version?: string): DDO {
        const ddo = new DDO(did)
        for (const name in DDO.supportedServices) {
            ddo.addService(name, url, version)
        }
        return ddo
    }

    /**
     * Create a DDO from a DDO JSON string.
     * @param ddoText DDO as a JSON string.
     * @returns a DDO object
     * @category Static Create
     */
    public static createFromString(ddoText: string): DDO {
        const data: IDDO = JSON.parse(ddoText)
        return new DDO(data['id'], data['service'])
    }

    /**
     * Create an empty DDO with an optional DID.
     * @param did Optional DID to add to the DDO object.
     * @returns a DDO object
     * @category Static Create
     */
    public static create(did?: string): DDO {
        return new DDO(did)
    }

    /**
     * Test to see if this DDO supports the service name. The service name can be
     * @param name of the service.
     *      meta, storage, invoke, market, trust, auth
     * @returns Boolean true if the service is supported by this agent DDO
     */
    public static isSupportedService(name: string): boolean {
        return name in DDO.supportedServices
    }

    /**
     * Constructs a new DDO object, please use the following static methods instead:
     *
     * {@link createFromServiceList}
     * {@link createForAllServices}
     * {@link createFromString}
     * {@link create}
     */
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

    /**
     * Add a new service, or update a current service.
     * @param name Name of the service to add or replace
     * @param url URL of the service
     * @param version Optional version number of the service API
     * @returns a IDDOService interface describing the new service.
     */
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

    /*
     * Remove a service from the DDO object.
     * @param name Name of the service to remove.
     * @returns True if the service was found and removed.
     */
    public removeService(name: string): boolean {
        let result = false
        const index = this.findServiceIndex(name)
        if (index >= 0) {
            this.service.splice(index, 1)
            result = true
        }
        return result
    }

    /*
     * Find a service and return it's index in the service list.
     * @param name Name of the service to find
     * @returns index >=0 if a service is found, else return -1
     */
    public findServiceIndex(name: string): number {
        let result = -1
        const nameRegExp = new RegExp(`\\.${name}\\.`, 'i')
        for (let index = 0; index < this.service.length; index++) {
            if (nameRegExp.test(this.service[index].type)) {
                result = index
                break
            }
        }
        return result
    }

    /*
     * Find a service and return the service record IDDOService.
     * @param name Name of the service to find.
     * @returns a valid IDDOService record, else return null
     */
    public findService(name: string): IDDOService {
        const index = this.findServiceIndex(name)
        if (index >= 0) {
            return this.service[index]
        }
        return null
    }

    /*
     * Convert this DDO object to string.
     */
    public toString(): string {
        return JSON.stringify(<IDDO>this)
    }

    /*
     * Return the DID for this DDO object.
     */
    public getDID(): string {
        return this.id
    }

    /*
     * Return a list of IDDOService records for services saved in this DDO object.
     */
    public getServiceList(): Array<IDDOService> {
        return this.service
    }
}
