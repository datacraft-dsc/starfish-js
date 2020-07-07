
# starfish-js

Toolkit for Decentralised Data Ecosystem development in Javascript

![](https://github.com/DEX-Company/starfish-js/workflows/testing/badge.svg)
[![GitHub contributors](https://img.shields.io/github/contributors/DEX-Company/starfish-js.svg)](https://github.com/DEX-Company/starfish-js/graphs/contributors)
[![dex-chain Version](https://img.shields.io/badge/dex--chain-master-blue.svg)](https://github.com/DEX-Company/dex-chain)

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

[starfish-js API documentation](https://dex-company.github.io/starfish-js)


## Prerequisites


## Development


1. Install requirements

    ```
    npm install
    ```

1. Create the local testing environment using [dex-chain](https://github.com/DEX-Company/dex-chain).

    In a sepearte terminal session you need to clone and checkout ```dex-chain``` repository, by doing the following:
    ```
    git clone https://github.com/DEX-Company/dex-chain.git
    cd dex-chain
    ./start_dex_chain.sh test
    ```

1. Run the unit tests

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
