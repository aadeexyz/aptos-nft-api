var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var _a = require('aptos'), Types = _a.Types, AptosClient = _a.AptosClient, AptosAccount = _a.AptosAccount;
require('dotenv').config();
var SEED = new Uint8Array([6, 9, 4, 2, 0]);
var app = express();
var port = process.env.PORT ? process.env.PORT : 3000;
var address = process.env.SMARTCONTRACT_ACCOUNT ? process.env.SMARTCONTRACT_ACCOUNT : "0x42059101c56319f1d804610f35c71cb27b71d7b30e45613fb3e938507372366c";
var nodeURL = process.env.NODE ? process.env.NODE : "https://fullnode.testnet.aptoslabs.com/v1/";
var client = new AptosClient(nodeURL);
var privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "0x0";
var privateKeyBuffer = Buffer.from(privateKey, 'hex');
// const aptosAccount = new AptosAccount(privateKeyBuffer);
var resourceAccount = AptosAccount.getResourceAccountAddress(address, SEED);
var resources;
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.getAccountResources(address)];
            case 1:
                resources = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
app.get("/token", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        id = req.params.id;
        res.json(resources[0]);
        return [2 /*return*/];
    });
}); });
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
