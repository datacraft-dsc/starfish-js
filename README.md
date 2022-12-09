
# starfish-js

Toolkit for Decentralised Data Ecosystem development in Javascript

![](https://github.com/datacraft-dsc/starfish-js/workflows/testing/badge.svg)
[![GitHub contributors](https://img.shields.io/github/contributors/datacraft-dsc/starfish-js.svg)](https://github.com/datacraft-dsc/starfish-js/graphs/contributors)
[![datacraft-chain Version](https://img.shields.io/badge/datacraft--chain-master-blue.svg)](https://github.com/datacraft-dsc/datacraft-chain)

---

## Table of Contents

  - [Overview](#overview)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Quickstart](#quickstart)
  - [Environment variables](#environment-variables)
  - [Code style](#code-style)
  - [Testing](#testing)
  - [New Version](#new-version)
  - [License](#license)

---
## Overview
Starfish-js is an open source developer toolkit for the data economy. It allows developers, data scientists and enterprises to create, interact, integrate and manage decentralised data supply lines through standardised and simple-to-use APIs.

Based on an underlying data ecosystem standard, Starfish provides high-level APIs for common tasks within the data economy, for example, registering/publishing an asset, for subsequent use in a digital supply line. In this case, an asset can be any data set, model or data service. The high-level API also allows developers to invoke operation on an asset, e.g. computing a predictive model or anonymising sensitive personal information, among other capabilities.

Starfish works with blockchain networks and common web services through agents, allowing unprecedented flexibility in asset discovery and data supply line management.

## Features

Currently only provide basic account balance information

## Documentation

[starfish-js API documentation](https://datacraft-dsc.github.io/starfish-js)

## Quick Start

To start using starfish-js, you first need to add the package to your package.json file as

    @datacraft-dsc/starfish-js

You then can write the following code to execute an operation called 'Tokenize Text' from a public test agent.

```typescript

    import { AgentManager } from '@datacraft-dsc/starfish-js'
    const agentURL = 'http://surfer-prod.southeastasia.cloudapp.azure.com:3030'

    // get the agent manager object to find the agent
    const agentManager = AgentManager.getInstance()

    // load in the agent based on it's URL and access deatils
    agent = await agentManager.loadAgent(agentURL, {
        username: 'Aladdin',
        password: 'OpenSesame',
    })

    // now call the 'Tokenize Text' operation
    const inputs = {
        text: 'test text to tokenize'
    }
    const result = await agent.invoke('Tokenize Text', inputs)
    console.log(result)

```

The output will look something like this:

```json
    {
        "status": "succeeded",
        "id": "60590c5d-eb4e-4b6a-9fa6-0a08c361fdcb",
        "outputs": {
            "tokens": [
                "test",
                "text",
                "to",
                "tokenize"
            ]
        }
    }
```

## Development

1. Create a GitHub personal access token (classic) with at least packages:read scope.

2. Create or edit the `~/.npmrc` file to include the following line:

```
//npm.pkg.github.com/:_authToken=TOKEN
```

3. Install requirements

    ```
    npm install
    ```

4. Run the unit tests

    ```
    npm run test
    ```

## Test/Develompent standalone web server

1. Building for the browser with debugging support

    ```
    npm run build:server

    # google-chrome --remote-debugging-port=9222

    # this is needed since metamask is not injected into web3 if url is file:// protocol

    npm run test:server

    # server test/standalone # this will expose current working directory as http://localhost:5000/

    # Run dubugging in VS Code with "Attach Chrome" configuration (test/server/.vscode/launch.json)
    ```

## Code style

ESlint recomended rules. Using the `"extends": "eslint:recommended"` parameter.
Also using Prettier standard with ESlint.

You need to run
    ```
    npm run lint
    ```

To make sure there are no formating and lint errors.


## Testing

Automatic tests are setup github actions. Using the `npm` framework.

To test run

    ```
    npm test
    ```

## Release Process

See [Release Process](https://github.com/datacraft-dsc/starfish-js/blob/develop/RELEASE_PROCESS.md)



## License

```
Copyright 2018 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
