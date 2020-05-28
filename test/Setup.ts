/*


    Test Config setting and loader

*/

import yaml from 'js-yaml'
import fs from 'fs-extra'

const CONFIG_FILENAME = 'test/resources/config_development.conf'

function loadConfig(filename): any {
    const doc = yaml.safeLoad(fs.readFileSync(filename))
    return doc
}

export function loadSetup(): any {
    let data = loadConfig(CONFIG_FILENAME)
    return data
}

