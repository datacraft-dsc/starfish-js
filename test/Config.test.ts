
import * as assert from "assert"

import Config from "../src/Config"


const TEST_VALUES = {

    'contract_path': 'test_contract_path_value',
    'storage_path': 'test storage path value',
    'ocean_url': 'test ocean url',
    'gas_limit': 12233,
    'aquarius_url': 'test aquarius url',
    'brizo_url': 'test brizo url',
    'secret_store_url': 'test secret store url',
    'parity_url': 'test parity url',
    'parity_address': 'test parity address',
    'parity_password': 'test_password'
}


describe("Config", () => {

    describe("Basic setup", () => {
        const config = new Config()
        assert(config)
        console.log(config.asText())
    })

    describe("Basic setup using JSON", () => {
        const config = new Config(TEST_VALUES)
        assert(config)
        console.log(config.asText())
    })
})
