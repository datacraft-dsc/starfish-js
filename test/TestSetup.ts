/*


    Test Config setting and loader

*/

import yaml from 'js-yaml'
import fs from 'fs-extra'
import urljoin from 'url-join'
import fetch, { Headers } from 'node-fetch'
import { Base64 } from 'js-base64'

const CONFIG_FILENAME = 'test/resources/config_local.yml'

function loadConfig(filename): any {
    const doc = yaml.safeLoad(fs.readFileSync(filename))
    return doc
}

export function loadTestSetup(): any {
    let data = loadConfig(CONFIG_FILENAME)
    return data
}

export async function enableSurferInvokableOperations(url: string, username: string, password: string): Promise<boolean> {

    const auth = Base64.encode(`${username}:${password}`)
    const headers = new Headers({
        Authorization: `Basic ${auth}`,
    })

    const importURL = urljoin(url, '/api/v1/admin/import-demo?id=operations')
    const response = await fetch(importURL, {
        method: 'POST',
        headers: headers,
    })
    if (response.ok) {
        return response.json()
    }
    return null
}
