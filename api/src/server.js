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

const SEED = new Uint8Array([6, 9, 4, 2, 0]);

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

const smartcontractAddress = process.env.SMARTCONTRACT_ACCOUNT
    ? process.env.SMARTCONTRACT_ACCOUNT
    : "0x42059101c56319f1d804610f35c71cb27b71d7b30e45613fb3e938507372366c";
const nodeURL = process.env.NODE
    ? process.env.NODE
    : "https://fullnode.testnet.aptoslabs.com/v1/";
const aptosClient = new AptosClient(nodeURL);

const transactionBuilder = new TransactionBuilderABI(
    ABI.map((abi) => new HexString(abi).toUint8Array())
);

const resourceAccount = AptosAccount.getResourceAccountAddress(
    smartcontractAddress,
    SEED
).hexString;

let collectionData;
let collection;
let baseTokenName;
let minted;
const fetchCollectionData = async () => {
    collectionData = await aptosClient.getAccountResource(
        smartcontractAddress,
        `0x${smartcontractAddress}::just_nfts::CollectionData`
    );
    collection = collectionData.data.collection_name;
    baseTokenName = collectionData.data.base_token_name;
    minted = collectionData.data.minted;
};
fetchCollectionData();

app.get("/token/:id", async (req, res) => {
    const id = req.params.id;

    const tokenClient = new TokenClient(aptosClient);
    try {
        const tokenData = await tokenClient.getTokenData(
            resourceAccount,
            collection,
            `${baseTokenName}${id}`
        );
        const uri = tokenData.uri;
        const identifier = uri.split("ipfs://")[1];

        const response = await fetch(
            `https://cloudflare-ipfs.com/ipfs/${identifier}`
        );
        const data = await response.json();

        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post("/register/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::register_token_store`,
            [],
            []
        );

        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json("Registered Token Store");
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post("/optin/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::opt_into_transfer`,
            [],
            []
        );

        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json("Opted into transfer");
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post("/mint/:privateKey", async (req, res) => {
    try {
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::mint`,
            [],
            []
        );

        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        await fetchCollectionData();

        res.json(`Minted ${baseTokenName}${minted}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

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

        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::transfer`,
            [],
            [to, id]
        );

        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json(`Transferred ${baseTokenName}${id} to ${to}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post("/burn/:id/:privateKey", async (req, res) => {
    try {
        const id = req.params.id;
        const privateKey = req.params.privateKey;
        const privateKeyClean = privateKey.replace("0x", "");
        const privateKeyBuffer = Buffer.from(privateKeyClean, "hex");
        const userAccount = new AptosAccount(privateKeyBuffer);

        const payload = transactionBuilder.buildTransactionPayload(
            `0x${smartcontractAddress}::just_nfts::burn`,
            [],
            [id]
        );

        await aptosClient.generateSignSubmitTransaction(userAccount, payload);

        res.json(`Burned ${baseTokenName}${id}`);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(port, () => {
    console.log(`JUST NFTs API listening on port ${port}`);
});
