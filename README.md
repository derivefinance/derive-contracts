# derive-contract

[![codecov](https://codecov.io/gh/derive-finance/derive-contract/branch/master/graph/badge.svg?token=CI26SD9SGE)](https://codecov.io/gh/derive-finance/derive-contract)
[![CI](https://github.com/derive-finance/derive-contract/workflows/CI/badge.svg)](https://github.com/derive-finance/derive-contract/actions?query=workflow%3ACI)

The smart contracts behind [derive.finance](https://derive.finance) 🤠

The contracts are compiled with [Hardhat](https://hardhat.org/getting-started/), and tested using [Waffle](https://hardhat.org/guides/waffle-testing.html#testing-with-ethers-js-waffle) and [TypeScript](https://hardhat.org/guides/typescript.html#typescript-support).

## Installation

```bash
$ npm i
```

## Usage

### Build

```bash
$ npm run build
```

### Test

```bash
$ npm test
```

### Coverage

```bash
$ npm run coverage
```

### Deploying contracts to localhost Hardhat EVM

```bash
$ npm run start
```

You can connect to this RPC server via `http://localhost:8545` with chain ID of 31337

### Deploying contracts to local fork of Mainnet

In order to successfully fork the mainnet, `ALCHEMY_API` must be set to a valid URL in the `.env` file.

```
ALCHEMY_API="https://eth-mainnet.alchemyapi.io/v2/XXXXXXXXXXXX"
```

```bash
$ npm run fork
```

You can connect to this RPC server via `http://localhost:8545` with chain ID of 1.

### Verify on bscscan

```bash
# lptoken example:
npx hardhat verify --network mainnet --constructor-args ./verify/DeriveBTCPoolLPToken-args.js 0x950cced347ad08ff845b8d807a49050d33fb2d40
```

### Generating GitBook docs

```bash
$ npx solidity-docgen --templates=templates
```

The output in the `docs` folder should be copied to the appropriate folder in the [derive-docs repo](https://github.com/derive-finance/derive-docs/tree/master/solidity-docs).

### Running Slither

[Slither](https://github.com/crytic/slither) is a Solidity static analysis framework. To run it locally:

```bash
$ pip3 install slither-analyzer
$ slither .
```

Slither is configured to run as a GitHub Action and error on any high findings.
