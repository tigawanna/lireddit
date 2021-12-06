"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resovers/hello");
const post_1 = require("./resovers/post");
const user_1 = require("./resovers/user");
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants");
const app = (0, express_1.default)();
const main = async () => {
    const allowedOrigins = ['http://localhost:3000',
        'https://studio.apollographql.com'];
    const corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    };
    app.use((0, cors_1.default)(corsOptions));
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            name: "bussin",
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        },
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.helloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res, redis })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });
};
main().catch(e => console.error("error with mikro", e));
app.listen(4000, () => {
    console.log("server running on localhost:4000");
});
console.log("this is strongly typed");
//# sourceMappingURL=index.js.map