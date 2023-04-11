# Rest API 🧞

This repository houses the rest api for Just NFTs.

## Table of Contents 📚
- [Overview](#overview-)
- [Files](#files-)
- [Endpoints](#endpoints-)
- [Getting Started](#getting-started-)
- [Usage](#usage-)
  - [Get NFT Data](#get-nft-data-)
  - [Mint](#mint-)
  - [Transfer](#transfer-)
  - [Burn](#burn-)
  - [Opt Into Transfer](#opt-into-transfer-)
  - [Register Token Store](#register-token-store-)
- [Running the API](#running-the-api-)

## Overview 👀
This is a simple rest api that uses the [Aptos SDK](https://aptos.dev/sdks/ts-sdk/index) and [Express](https://expressjs.com/) to interact with the Just NFTs smart contract.

## Files 📁
- `server.js` - API server file
- `abi.js` - Contains the ABI of the smart contract

## Endpoints 📡
| Endpoint | Method | Description |
| --- | --- | --- |
| [`/token/<TOKEN ID>`](#get-nft-data-) | GET | Get the data of an NFT |
| [`/mint/<PRIVATE KEY>`](#mint-) | POST | Mint an NFT to the caller's account |
| [`/transfer/<TOKEN ID>/<PRIVATE KEY>/<RECIPIENT ADDRESS>`](#transfer-) | POST | Transfer an NFT to the recipient |
| [`/burn/<TOKEN ID>/<PRIVATE KEY>`](#burn-) | POST | Burn an NFT |
| [`/optin/<PRIVATE KEY>`](#opt-into-transfer-) | POST | Opt into transfers |
| [`/register/<PRIVATE KEY>`](#register-token-store-) | POST | Register the token store |

## Getting Started 🚀
Before calling any endpoints make sure you send **POST** requests to `/optin/<PRIVATE KEY>` and `/register/<PRIVATE KEY>` to opt-in to the transfer and register the token store.

## Usage ⚙️

### Get NFT Data 📥
> **GET** request to `/token/<TOKEN ID>`

The `/token/<TOKEN ID>` endpoint can be called to get the data of an NFT.

It takes a `token id` as an argument.

This endpoint will fail if the token does not exist or the token id is out of range.

### Mint 🎨
> **POST** request to `/mint/<PRIVATE KEY>`

The `/mint/<PRIVATE KEY>` endpoint can be called to mint and NFT to the caller's account.

It takes a `private key` as an argument.

This endpoint will fail if the caller has **not opted into the transfer** and **token store**.


### Transfer 📤
> **POST** request to `/transfer/<TOKEN ID>/<PRIVATE KEY>/<RECIPIENT ADDRESS>`

The `/transfer/<TOKEN ID>/<PRIVATE KEY>/<RECIPIENT ADDRESS>` endpoint can be called to transfer an NFT to the recipient.

It takes a `token id`, `private key`, and `recipient address` as arguments.

This endpoint will fail if the receiver has **not opted into the transfer** and **token store** or if the **caller is not the owner** of the set token. The endpoint would also fail if the **token does not exist** or the **token id is out of range**.

### Burn 🔥
> **POST** request to `/burn/<TOKEN ID>/<PRIVATE KEY>`

The `/burn/<TOKEN ID>/<PRIVATE KEY>` endpoint can be called to burn an NFT.

It takes a `token id` and `private key` as arguments.

This endpoint will fail if the **caller is not the owner** of the set token. The endpoint would also fail if the **token does not exist** or the **token id is out of range**.

### Opt Into Transfer 📥
> **POST** request to `/optin/<PRIVATE KEY>`

The `/optin/<PRIVATE KEY>` endpoint can be called to opt into transfers. This allows the account to receive NFTs.

It takes a `private key` as an argument.

### Register Token Store 📥
> **POST** request to `/register/<PRIVATE KEY>`

The `/register/<PRIVATE KEY>` endpoint can be called to register the token store.

It takes a `private key` as an argument.

## Running the API 🏃‍♂️
Clone the repository and run `pnpm install` to install the dependencies.

Run the following command to start the api server:
```bash
node src/server.js
```
