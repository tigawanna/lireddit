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


const main= async ()=>{
const orm=await MikroORM.init(mikroOrmConfig);
await orm.getMigrator().up();

const app=express();

app.get('/',(_,res)=>{
res.send("hello dork")
})
const apolloServer=new ApolloServer({
schema:await buildSchema({
    resolvers:[helloResolver,PostResolver,UserResolver],
    validate:false
}),
context:()=>({em:orm.em})
});
await apolloServer.start()
apolloServer.applyMiddleware({app});
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