/*

    Test DDO

*/

import { assert } from 'chai'

import DDO from '../src/DDO/DDO'

describe('DDO Class', () => {
    it('should create a new ddo object from a list of services', async () => {
        const testURL = 'http://mytesturl.com'
        const ddo = DDO.createFromServiceList(testURL, ['meta', 'invoke'])
        assert(ddo)
        assert.equal(ddo.data.service.length, 2)
        assert.equal(ddo.getServiceList().length, 2)
        assert(ddo.data.id)
        assert(ddo.getDID())
    })

    it('should create a new ddo object using all services', async () => {
        const testURL = 'http://mytesturl.com'
        const ddo = DDO.createForAllServices(testURL)
        assert(ddo)
        assert.equal(ddo.data.service.length, 6)
        assert.equal(ddo.getServiceList().length, 6)
        assert(ddo.data.id)
        assert(ddo.getDID())
    })

    it('should create a new ddo object using a text json ddo', async () => {
        const testURL = 'http://mytesturl.com'
        const ddo = DDO.createForAllServices(testURL)
        assert(ddo)
        const ddoText = ddo.toString()
        const readDDO = DDO.createFromString(ddoText)
        assert.equal(readDDO.data.service.length, 6)
        assert.equal(readDDO.getServiceList().length, 6)
        assert(readDDO.data.id)
        assert(readDDO.getDID())
        assert.equal(ddo.data.id, readDDO.data.id)
    })
    it('should create an empty DDO object', async () => {
        const ddo = DDO.create()
        assert(ddo)
        assert.equal(ddo.data.service.length, 0)
        assert.equal(ddo.getServiceList().length, 0)
        assert(ddo.data.id)
        assert(ddo.getDID())
    })
    it('should test a correct supported service name', async () => {
        assert(DDO.isSupportedService('meta'))
        assert.isFalse(DDO.isSupportedService('metabeta'))
    })

})
