/*


    Test Config setting and loader

*/

import yaml from 'js-yaml'
import fs from 'fs-extra'
import { urlJoin } from 'url-join-ts'
import fetch, { Headers } from 'node-fetch'
import { Base64 } from 'js-base64'

const CONFIG_FILENAME = 'test/resources/config_local.yml'

function loadConfig(filename): any {
    const doc = yaml.safeLoad(fs.readFileSync(filename))
    return doc
}

export function loadTestSetup(): any {
    return loadConfig(CONFIG_FILENAME)
}

export async function enableSurferInvokableOperations(url: string, username: string, password: string): Promise<boolean> {

    const auth = Base64.encode(`${username}:${password}`)
    const headers = new Headers({
        Authorization: `Basic ${auth}`,
    })

    const importURL = urlJoin(url, '/api/v1/admin/import-demo?id=operations')
    const response = await fetch(importURL, {
        method: 'POST',
        headers: headers,
    })
    if (response.ok) {
        return response.json()
    }
    return null
}
