import express from "express";
import {
    AptosClient,
    AptosAccount,
    TokenClient,
    TransactionBuilderABI,
    HexString,
} from "aptos";
import { ABI } from "./abi.js";
import * as dotenv from "dotenv";
dotenv.config();

/// @dev Seed for generating the resource account
/// @dev Same as the seed used in the smart contract
const SEED = new Uint8Array([6, 9, 4, 2, 0]);

/// @dev Express server
const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

/// @dev Setting the smart contract address
const smartcontractAddress = process.env.SMARTCONTRACT_ACCOUNT
    ? process.env.SMARTCONTRACT_ACCOUNT
    : "0x42059101c56319f1d804610f35c71cb27b71d7b30e45613fb3e938507372366c";
/// @dev Setting the node URL
const nodeURL = process.env.NODE
    ? process.env.NODE
    : "https://fullnode.testnet.aptoslabs.com/v1/";
/// @dev Initializing the aptos client
const aptosClient = new AptosClient(nodeURL);

/// @dev Initializing the transaction builder with the ABI
const transactionBuilder = new TransactionBuilderABI(
    ABI.map((abi) => new HexString(abi).toUint8Array())
);

/// @dev Generating the resource account address
const resourceAccount = AptosAccount.getResourceAccountAddress(
    smartcontractAddress,
    SEED
).hexString;

/// @dev Fetching the collection data
let collectionData;
let collection;
let baseTokenName;
let minted;
const fetchCollectionData = async () => {
    /// @dev Fetching the collection data from resource
    collectionData = await aptosClient.getAccountResource(
        smartcontractAddress,
        `0x${smartcontractAddress}::just_nfts::CollectionData`
    );
    /// @dev Setting the collection data
    collection = collectionData.data.collection_name;
    baseTokenName = collectionData.data.base_token_name;
    minted = collectionData.data.minted;
};
fetchCollectionData();

/// @dev This is a GET request to get the token data
/// @param id - Token ID (0 - 9)
app.get("/token/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const tokenClient = new TokenClient(aptosClient);
        /// @dev Fetching the token data
        const tokenData = await tokenClient.getTokenData(
            resourceAccount,
            collection,
            `${baseTokenName}${id}`
        );
        const uri = tokenData.uri;
        const identifier = uri.split("ipfs://")[1];

        /// @dev Fetching the token metadata from IPFS using Cloudflare-IPFS gateway
        const response = await fetch(
            `https://cloudflare-ipfs.com/ipfs/${identifier}`
        );
        const data = await response.json();

        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev This is a POST request to register token store
/// @param privateKey - User's private key
app.post("/register/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        /// @dev Building the transaction payload
        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::register_token_store`,
            [],
            []
        );

        /// @dev Generating, signing and submitting the transaction
        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json("Registered Token Store");
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev This is a POST request to opt into direct transfer
/// @param privateKey - User's private key
app.post("/optin/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        /// @dev Building the transaction payload
        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::opt_into_transfer`,
            [],
            []
        );

        /// @dev Generating, signing and submitting the transaction
        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json("Opted into transfer");
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev This is a POST request to mint token
/// @param privateKey - User's private key
app.post("/mint/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        /// @dev Building the transaction payload
        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::mint`,
            [],
            []
        );

        /// @dev Generating, signing and submitting the transaction
        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        /// @dev Fetching the updated collection data
        await fetchCollectionData();

        res.json(`Minted ${baseTokenName}${minted}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev This is a POST request to transfer token
/// @param id - Token ID (0 - 9)
/// @param privateKey - User's private key
/// @param to - Address to transfer to
app.post("/transfer/:id/:privateKey/:to", async (req, res) => {
    try {
        const id = req.params.id;
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);
        const pramTo = req.params.to;
        const toClean = pramTo.replace("0x", "");
        const to = `0x${toClean}`;

        /// @dev Building the transaction payload
        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::transfer`,
            [],
            [to, id]
        );

        /// @dev Generating, signing and submitting the transaction
        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json(`Transferred ${baseTokenName}${id} to ${to}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev This is a POST request to burn token
/// @param id - Token ID (0 - 9)
/// @param privateKey - User's private key
app.post("/burn/:id/:privateKey", async (req, res) => {
    try {
        const id = req.params.id;
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        /// @dev Building the transaction payload
        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::burn`,
            [],
            [id]
        );

        /// @dev Generating, signing and submitting the transaction
        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json(`Burned ${baseTokenName}${id}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/// @dev Starting the server
app.listen(port, () => {
    console.log(`JUST NFTs API listening on port ${port}`);
});
