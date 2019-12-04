
# starfish-js

Toolkit for Decentralised Data Ecosystem development in Javascript

[![Travis (.com)](https://img.shields.io/travis/com/DEX-Company/starfish-js.svg)](https://travis-ci.com/DEX-Company/starfish-js)
[![GitHub contributors](https://img.shields.io/github/contributors/DEX-Company/starfish-js.svg)](https://github.com/DEX-Company/starfish-js/graphs/contributors)
[![Squid Version](https://img.shields.io/badge/squid--js-v0.5.14-blue.svg)](https://github.com/oceanprotocol/squid-py/releases/tag/v0.3.2)
[![Barge Version](https://img.shields.io/badge/barge-dex--2019--05--24-blue.svg)](https://github.com/DEX-Company/barge/releases/tag/dex-2019-05-24)

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

## Prerequisites


## Development


1. Install requirements

    ```
    npm install
    ```

1. Create the local testing environment using [barge](https://github.com/DEX-Company/barge).

    In a sepearte terminal session you need to clone and checkout the correct taged
    version of ```barge``` repository, by doing the following:
    ```
    git clone https://github.com/DEX-Company/barge.git
    cd barge
    git checkout tags/dex-2019-05-24
    ./start_ocean.sh --no-brizo --no-pleuston --local-spree-node
    ```

1. Copy keeper artifacts

    A bash script is available to copy keeper artifacts into this file directly from a running docker image. This script needs to run in the root of the project.
    The script waits until the keeper contracts are deployed, and then copies the artifacts.

    ```
    ./scripts/wait_for_migration_and_extract_keeper_artifacts.sh
    ```

    The artifacts contain the addresses of all the deployed contracts and their ABI definitions required to interact with them.

1. Run the unit tests

    ```
    npm run test
    ```
## Documentation


## Code style


## Testing

Automatic tests are setup via Travis, executing `tox`.
Our test use npm framework.

## New Version

The `bumpversion.sh` script helps to bump the project version. You can execute the script using as first argument {major|minor|patch} to bump accordingly the version.

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
