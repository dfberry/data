"use strict";
// Azure Cosmos script to remove all containers then recreate them
// Usage: `node scripts/reset-database.js`
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
const cosmos_1 = require("@azure/cosmos");
require("dotenv/config");
const databaseDefinition = require("../../../database_definition.json");
function wait(ms) {
    //return new Promise(resolve => setTimeout(resolve, ms));
    return Promise.resolve();
}
const resetDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    try {
        const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Missing AZURE_COSMOS_CONNECTION_STRING environment variable');
        }
        const client = new cosmos_1.CosmosClient(connectionString);
        for (const database of databaseDefinition) {
            const dbDeleteResult = yield client.database(database.databaseName).delete();
            yield wait(5000);
            if (dbDeleteResult.statusCode === 204) {
                console.log(`Deleted database: ${database.databaseName}`);
            }
            else {
                console.error(`Failed to delete database: ${database.databaseName} with code ${dbDeleteResult.statusCode}`);
            }
        }
        try {
            for (var _g = true, databaseDefinition_1 = __asyncValues(databaseDefinition), databaseDefinition_1_1; databaseDefinition_1_1 = yield databaseDefinition_1.next(), _a = databaseDefinition_1_1.done, !_a; _g = true) {
                _c = databaseDefinition_1_1.value;
                _g = false;
                const db = _c;
                const dbRequest = {
                    id: db.databaseName
                };
                const dbResponse = yield client.databases.create(dbRequest);
                yield wait(5000);
                if (dbResponse.statusCode === 201) {
                    console.log(`Created database: ${dbResponse.database.id}`);
                    try {
                        for (var _h = true, _j = (e_2 = void 0, __asyncValues(db.containers)), _k; _k = yield _j.next(), _d = _k.done, !_d; _h = true) {
                            _f = _k.value;
                            _h = false;
                            const container = _f;
                            console.log(`Creating container: ${container.name}`);
                            const containerRequest = {
                                id: container.name,
                                partitionKey: container.partitionKey
                            };
                            const containerResponse = yield client.database(db.databaseName).containers.create(containerRequest);
                            yield wait(5000);
                            console.log(`Container: ${container.name} created in database: ${containerResponse.statusCode === 201 ? 'succeeded' : 'failed'}`);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_h && !_d && (_e = _j.return)) yield _e.call(_j);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = databaseDefinition_1.return)) yield _b.call(databaseDefinition_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        console.error(error);
    }
});
resetDatabase().catch(console.error);
//# sourceMappingURL=reset-database.js.map