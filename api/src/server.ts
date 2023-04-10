const express = require("express")
const { Types, AptosClient, AptosAccount } = require('aptos');
require('dotenv').config();

const SEED = new Uint8Array([6, 9, 4, 2, 0]);

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

const address = process.env.SMARTCONTRACT_ACCOUNT ? process.env.SMARTCONTRACT_ACCOUNT : "0x42059101c56319f1d804610f35c71cb27b71d7b30e45613fb3e938507372366c";
const nodeURL = process.env.NODE ? process.env.NODE : "https://fullnode.testnet.aptoslabs.com/v1/";
const client = new AptosClient(nodeURL);

const privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "0x0";
let privateKeyBuffer = Buffer.from(privateKey, 'hex');

// const aptosAccount = new AptosAccount(privateKeyBuffer);
const resourceAccount = AptosAccount.getResourceAccountAddress(address, SEED);
let resources;

(async () => {
    resources = await client.getAccountResources(address);
})()



app.get("/token", async (req: any, res: any) => {
    let id = req.params.id;

    res.json(resources);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});