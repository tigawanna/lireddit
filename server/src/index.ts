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
import Redis from 'ioredis';
import session from 'express-session';

import connectRedis from 'connect-redis'
// import {connect} from 'http2'
import MyContex from './types';
import { cors } from 'cors';
import { COOKIE_NAME } from './constants';
import { sendEmail } from './utils/sendEmail';
import { User } from './entities/User';
import {createConnection} from 'typeorm'
import { Post } from './entities/Posts';
import path from "path"
import { Updoot } from './entities/Updoot';



const app=express();
const main= async ()=>{


  const conn=await createConnection({
    type:'postgres',
    database:'lireddit2',
    username:'postgres',
     password:'password',
     logging:true,
     synchronize:true,
     migrations:[path.join(__dirname,"./migrations/*")],
     entities:[Post,User,Updoot]

  })

  // await conn.runMigrations();
  // await Post.delete({});


  const allowedOrigins = ['http://localhost:3000',
  'https://studio.apollographql.com'];
  const corsOptions = {
  credentials: true,
    origin: function(origin, callback){
     if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }
  
app.use(cors(corsOptions))  





const RedisStore =connectRedis(session)
const redis = new Redis();

app.use(session({
  name:COOKIE_NAME,
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
    client: redis,
    disableTouch:true,
}),
}))



const apolloServer=new ApolloServer({
schema:await buildSchema({
    resolvers:[helloResolver,PostResolver,UserResolver],
    validate:false
}),
context:({req,res}):MyContex=>({req,res,redis})
});
await apolloServer.start()
apolloServer.applyMiddleware({app,cors:corsOptions});
}

main().catch(e=>console.error("error with mikro",e));



app.listen(4000,()=>{
  console.log("server running on localhost:4000")
  });


console.log("this is strongly typed")
