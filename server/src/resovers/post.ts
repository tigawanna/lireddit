import {Resolver,Query,Mutation,Ctx,Arg,Int} from 'type-graphql'
import { Post } from './../entities/Posts';
import MyContex from './../types';

@Resolver()
export class PostResolver{

@Query(()=>[Post])
posts(
@Ctx() {em}:MyContex) :Promise<Post[]>{
   return em.find(Post,{})
}

@Query(()=>Post,{nullable:true})
post(
@Arg('id',()=>Int) _id:number,
@Ctx() {em}:MyContex) :Promise<Post|null>{
   return em.findOne(Post,{_id})
}

@Mutation(()=>Post)
async createPost(
@Arg('title',()=>String) title:String,
@Ctx() {em,req}:MyContex) :Promise<Post>{
req.session.deeznuts="blue"
const post= em.create(Post,{title})
await em.persistAndFlush(post)
 return post
}


@Mutation(()=>Post,{nullable:true})
async updatePost(
@Arg('id',()=>Int) _id:number,
@Arg('title',()=>String,{nullable:true}) title:String,
@Ctx() {em}:MyContex) :Promise<Post|null>{
const post= await em.findOne(Post,{_id})
if(!post){
return null
}
if(typeof title!=="undefined"){
post.title=title
await em.persistAndFlush(post)

}
 return post
}



@Mutation(()=>Boolean)
async deletePost(
@Arg('id',()=>Int) _id:number,
@Ctx() {em}:MyContex) :Promise<boolean>{
await em.nativeDelete(Post,{_id})
return true

}



}
