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
var cors = require('cors')

import redis from 'redis';
import session from 'express-session';

import connectRedis from 'connect-redis'
// import {connect} from 'http2'
import MyContex from './types';



const main= async ()=>{
const orm=await MikroORM.init(mikroOrmConfig);
await orm.getMigrator().up();

const app=express();



const RedisStore =connectRedis(session)
const redisClient = redis.createClient()

app.use(
    session({
      name:'comesuckondeeznuts',
      store: new RedisStore({ 
          client: redisClient,
          disableTouch:true,
     }),
     cookie:{
         maxAge:1000*60*60*24*365*10,
         httpOnly:true,
        //  sameSite:'lax',
        sameSite:'none',
         secure:false  //cookie only works in https
     },
      saveUninitialized: false,
      secret: 'tgytxgftfyf',
      resave: false,
     
    })
  )

app.get('/',(_,res)=>{
res.send("hello dork")
})
const apolloServer=new ApolloServer({
schema:await buildSchema({
    resolvers:[helloResolver,PostResolver,UserResolver],
    validate:false
}),
context:({req,res}):MyContex=>({em:orm.em,req,res})
});
await apolloServer.start()

const corsOptions = {
  origin: " https://studio.apollographql.com",
  // origin: " http://localhost:3000",
  credentials: true,
}

// app.use(cors())

apolloServer.applyMiddleware({app,cors:corsOptions});
app.listen(4000,()=>{
console.log("server running on localhost:4000")
})

// const post =orm.em.create(Post,{title:"my  first post"})
// await orm.em.persistAndFlush(post)

// const posts=await orm.em.find(Post,{})
// console.log("------posts retireveed-------",posts)


}

main().catch(e=>console.error("error with mikro",e));


console.log("this is strongly typed")