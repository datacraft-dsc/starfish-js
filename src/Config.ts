
import * as ini from "ini"

interface IConfig {
    keeper_url?: string
    contract_path?: string
    secret_store_url?: string
    parity_url?: string
    parity_address?: string
    parity_password?: string
    aquarius_url?: string
    brizo_url?: string
    storage_path?: string
    download_path?: string
    agent_store_did?: string
    agent_store_auth?: string
    gas_limit?: number
}

export default class Config {

    private static CONFIG_DEFAULT: string = `
[ocean]
keeper_url = http://localhost:8545
contract_path = artifacts
secret_store_url = http://localhost:8010
parity_url = http://localhost:9545
parity_address = 0x00bd138abd70e2f00903268f3db08f2d25677c9e
parity_password = node0
aquarius_url = http://localhost:5000
brizo_url = http://localhost:8030
storage_path = squid_py.db
download_path = consume_downloads
agent_store_did =
agent_store_auth =
gas_limit = 300000
`

    public values: IConfig = {}

    public constructor(setupValues?: any) {
        const allDefaults = ini.decode(Config.CONFIG_DEFAULT)
        const oceanDefaults: IConfig = allDefaults.ocean
        let objectValues = setupValues ? setupValues : {}
        if (typeof setupValues === "string") {
            objectValues = ini.decode(setupValues)
        }
        // copy over only used config items as values
        for ( const name in oceanDefaults ) {
            if (name) {
                this.values[name] = oceanDefaults[name]
                if (name in objectValues) {
                    this.values[name] = objectValues[name]
                }
            }
        }
    }
    public asText(): string {
        const result: string[] = []
        for ( const name in this.values) {
            if ( name ) {
                result.push(name + "=" + this.values[name])
            }
        }
        return result.join("\n")
    }

    public asSquid(): any {
        const config: any = {}

        config.nodeUri = this.values.keeper_url
        config.secretStoreUri = this.values.secret_store_url
        config.parityUri = this.values.parity_url
        config.parityAddress = this.values.parity_address
        config.parityPassword = this.values.parity_password
        config.aquariusUri = this.values.aquarius_url
        config.brizoUri = this.values.brizo_url
        return config
    }
}
