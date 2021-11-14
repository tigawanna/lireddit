"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Posts_1 = require("./entities/Posts");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Posts_1.Post],
    dbName: 'lireddit',
    user: 'postgres',
    password: 'password',
    type: 'postgresql',
    debug: !constants_1._prod
};
//# sourceMappingURL=mikro-orm.config.js.map