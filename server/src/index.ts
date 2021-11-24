// @ts-nocheck
import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core';
import { _prod } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { helloResolver } from './resovers/hello';
import { PostResolver } from './resovers/post';
import { UserResolver } from './resovers/user';

import cors, { CorsOptions } from 'cors'
import redis from 'redis';
import session from 'express-session';

import connectRedis from 'connect-redis'
// import {connect} from 'http2'
import MyContex from './types';
import { cors } from 'cors';


const app=express();
const main= async ()=>{

  const corsOptions = {
    // origin: " https://studio.apollographql.com",
    origin: " http://localhost:3000",
    credentials: true,
  }
app.use(cors(corsOptions))  
const orm=await MikroORM.init(mikroOrmConfig);
await orm.getMigrator().up();

const RedisStore =connectRedis(session)
const redisClient = redis.createClient()


// app.use(session({
// name:'deeznuts',
// store: new RedisStore({ 
//     client: redisClient,
//     disableTouch:true,
// }),
//   name:"boobos",
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { 
//     name:"bussin",
//     secure: true ,
//     httpOnly:false,
//     sameSite:'none',
//     maxAge:1000*60*60*24*365*10,
//   },
//   saveUninitialized: false,
//   secret: 'tgytxgftfyf',
//   resave: false,
// }))

app.use(session({
  name:'deeznuts',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    name:"bussin",
    secure: false ,
    httpOnly:true,
    sameSite:"lax",
    maxAge:1000*60*60*24*365*10,
  },
  store: new RedisStore({ 
    client: redisClient,
    disableTouch:true,
}),
}))



const apolloServer=new ApolloServer({
schema:await buildSchema({
    resolvers:[helloResolver,PostResolver,UserResolver],
    validate:false
}),
context:({req,res}):MyContex=>({em:orm.em,req,res})
});
await apolloServer.start()
apolloServer.applyMiddleware({app,cors:corsOptions});
}

main().catch(e=>console.error("error with mikro",e));



app.listen(4000,()=>{
  console.log("server running on localhost:4000")
  });


console.log("this is strongly typed")
