import * as squid from "@oceanprotocol/squid"
import Config from "./Config"

export default class Ocean {

    public static async getInstance(config: Config): Promise<Ocean> {
        if (!Ocean.instance) {
            Ocean.instance = new Ocean()
            await Ocean.instance.init(config)
        }
        return Ocean.instance
    }

    private static instance
    private oceanSquid: squid.Ocean

    private constructor() {
    }

    public async init(config: Config) {
        this.oceanSquid = await squid.Ocean.getInstance(config.asSquid())
    }

    public getSquid() {
        return this.oceanSquid
    }
}
