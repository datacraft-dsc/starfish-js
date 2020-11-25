/*

    Test DDO

*/

import { assert } from 'chai'

import { DDO } from 'starfish'

describe('DDO Class', () => {
    describe('createFromServiceList', () => {
        it('should create a new ddo object from a list of services', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createFromServiceList(testURL, ['meta', 'invoke'])
            assert(ddo)
            assert.equal(ddo.service.length, 2)
            assert.equal(ddo.getServiceList().length, 2)
            assert(ddo.id)
            assert(ddo.getDID())
        })
    })

    describe('createForAllServices', () => {
        it('should create a new ddo object using all services', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createForAllServices(testURL)
            assert(ddo)
            assert.equal(ddo.service.length, 6)
            assert.equal(ddo.getServiceList().length, 6)
            assert(ddo.id)
            assert(ddo.getDID())
        })
    })

    describe('createFromString', () => {
        it('should create a new ddo object using a text json ddo', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createForAllServices(testURL)
            assert(ddo)
            const ddoText = ddo.toString()
            const readDDO = DDO.createFromString(ddoText)
            assert.equal(readDDO.service.length, 6)
            assert.equal(readDDO.getServiceList().length, 6)
            assert(readDDO.id)
            assert(readDDO.getDID())
            assert.equal(ddo.id, readDDO.id)
        })
    })
    describe('create', () => {
        it('should create an empty DDO object', async () => {
            const ddo = DDO.create()
            assert(ddo)
            assert.equal(ddo.service.length, 0)
            assert.equal(ddo.getServiceList().length, 0)
            assert(ddo.id)
            assert(ddo.getDID())
        })
    })

    describe('isSupportedService', () => {
        it('should test a correct supported service name', async () => {
            assert(DDO.isSupportedService('meta'))
            assert.isFalse(DDO.isSupportedService('metabeta'))
        })
    })

    describe('addService', () => {
        it('should add a new service', async () => {
            const ddo = DDO.create()
            assert(ddo)
            ddo.addService('meta', 'locahost/meta')
            assert.equal(ddo.service.length, 1)
            assert.equal(ddo.getServiceList().length, 1)
        })
    })

    describe('removeService', () => {
        it('should remove a service', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createForAllServices(testURL)
            assert(ddo)
            const expectedServiceLength = ddo.service.length - 1
            ddo.removeService('meta')
            assert.equal(ddo.service.length, expectedServiceLength)
        })
    })

    describe('findServiceIndex', () => {
        it('should find the service index', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createForAllServices(testURL)
            assert(ddo)
            const index = ddo.findServiceIndex('meta')
            assert.isAtLeast(index, 0)
        })
    })
    describe('findService', () => {
        it('should find the service index', async () => {
            const testURL = 'http://mytesturl.com'
            const ddo = DDO.createForAllServices(testURL)
            assert(ddo)
            const service = ddo.findService('auth')
            assert(service)
        })
    })

})
