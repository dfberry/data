"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
require("dotenv/config");
const functionWebjobs = require("../../../function_webjobs_definition.json");
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const resetFunctionWebJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
        }
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        try {
            // delete all containers
            for (var _k = true, functionWebjobs_1 = __asyncValues(functionWebjobs), functionWebjobs_1_1; functionWebjobs_1_1 = yield functionWebjobs_1.next(), _a = functionWebjobs_1_1.done, !_a; _k = true) {
                _c = functionWebjobs_1_1.value;
                _k = false;
                const container = _c;
                const containerName = container.containerName;
                console.log(`Reading container: ${containerName}`);
                const containerClient = blobServiceClient.getContainerClient(containerName);
                // list all blobs
                let response = yield containerClient.listBlobsFlat();
                try {
                    for (var _l = true, response_1 = (e_2 = void 0, __asyncValues(response)), response_1_1; response_1_1 = yield response_1.next(), _d = response_1_1.done, !_d; _l = true) {
                        _f = response_1_1.value;
                        _l = false;
                        const blob = _f;
                        console.log(`Blob name: ${blob.name}`);
                        try {
                            for (var _m = true, _o = (e_3 = void 0, __asyncValues(container.paths)), _p; _p = yield _o.next(), _g = _p.done, !_g; _m = true) {
                                _j = _p.value;
                                _m = false;
                                const partialPath = _j;
                                // check if blob name contains the partial path
                                if (blob.name.includes(partialPath)) {
                                    console.log(`Deleting blob name: ${blob.name} for partial path: ${partialPath}`);
                                    // delete the blob
                                    const blobClient = containerClient.getBlobClient(blob.name);
                                    yield blobClient.delete();
                                    console.log(`Deleted blob`);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (!_m && !_g && (_h = _o.return)) yield _h.call(_o);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_l && !_d && (_e = response_1.return)) yield _e.call(response_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = functionWebjobs_1.return)) yield _b.call(functionWebjobs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        console.error(error);
    }
});
resetFunctionWebJobs().catch(console.error);
//# sourceMappingURL=reset-function-webjobs.js.map