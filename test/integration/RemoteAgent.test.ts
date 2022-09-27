/*

    Test Colife Agent

*/

import { assert } from 'chai'
import fs from 'fs-extra'

import { loadTestSetup } from 'test/TestSetup'

import { AgentManager, DataAsset } from 'starfish'

let setup = loadTestSetup()
const agentConfig = setup.agents['colife']
const agentAuthentication = {
    username: process.env.npm_config_test_colife_username,
    password: process.env.npm_config_test_colife_password,
}

const TEST_USER_ID = '99HY2Y'
const TEST_PDF_FILENAME = 'test/resources/data/test.pdf'
const GET_USER_INFO = 'get_info_profile'
// const UPLOAD_PDF_DOCUMENT = 'upload_api_document'



const isTestAgentSetup = agentAuthentication.password !== undefined
const agentManager = AgentManager.getInstance()


describe('Remote Agent access at Colife', () => {
    if (isTestAgentSetup) {
        describe('connect', () => {
            it('should connect to the remote agent', async () => {
                const agent = await agentManager.loadAgent(agentConfig['url'], agentAuthentication)
                assert(agent)
            })
        })
        describe('find user contact details', async() => {
            let agent
            let userRecord
            before(async () => {
                agent = await agentManager.loadAgent(agentConfig['url'], agentAuthentication)
                const inputs = {
                    user_id: TEST_USER_ID
                }
                const result = await agent.invoke(GET_USER_INFO, inputs)
                assert(result)
                assert(result.outputs.asset_did.did)
                const asset = await agent.downloadAsset(result.outputs.asset_did.did)
                const records = asset.csv({
                    delimiter: ',',
                    columns: true
                })
                assert(records)
                userRecord = records[0]
                assert(userRecord)
            })
            it('should get the test user info using contact number', async() => {
                const inputs = {
                    contact: userRecord.contact
                }
                const result = await agent.invoke(GET_USER_INFO, inputs)
                assert(result)
                assert(result.outputs.asset_did.did)
                const asset = await agent.downloadAsset(result.outputs.asset_did.did)
                const records = asset.csv({
                    delimiter: ',',
                    columns: true
                })
                assert(records)
                const record = records[0]
                assert.equal(record.user_id, userRecord.user_id)
            })
        })
        describe('save test asset pdf file', async () => {
            let agent
            let pdfData = fs.readFileSync(TEST_PDF_FILENAME)
            before(async () => {
                agent = await agentManager.loadAgent(agentConfig['url'], agentAuthentication)
                pdfData = fs.readFileSync(TEST_PDF_FILENAME)
            })
            it('should save a test asset as a pdf file', async () => {
                const asset = DataAsset.create('test.pdf', pdfData, {contentType: 'application/pdf'})
                const pdfAsset = await agent.registerAsset(asset)
                const result = await agent.uploadAsset(pdfAsset)
                assert(result)
                assert(pdfAsset.did)
            })
            it('should upload a pdf document to the users folder', async () => {
                const asset = DataAsset.create('test.pdf', pdfData, {contentType: 'application/pdf'})
                const pdfAsset = await agent.registerAsset(asset)
                const result = await agent.uploadAsset(pdfAsset)
                assert(result)
                assert(pdfAsset.did)
                /*
                const uploadInput = {
                    asset_did: pdfAsset.did,
                    name: 'test_pdf.pdf',
                    user_id: TEST_USER_ID
                }
                const uploadResult = await agent.invoke(UPLOAD_PDF_DOCUMENT, uploadInput)
                console.log(uploadResult)
                assert(uploadResult)
                assert.equal(uploadResult.status, 'succeeded')
                */

            })

        })
    }
    else {
        describe('no remote agent setup details', () => {
            it('should always pass on the config object', () => {
                assert(agentConfig)
            })
        })
    }

})


