import {Resolver,Query,Mutation,Arg,Int, InputType,
    Field, Ctx, UseMiddleware, FieldResolver, Root,ObjectType} from 'type-graphql'
import { Post } from './../entities/Posts';
import { sleep } from '../utils/sleep';
import MyContex from './../types';
import { isAuth } from './../middleware/isAuth';
import { getConnection } from 'typeorm';


@InputType()
class PostInput{
 @Field()
 title: string;
 @Field()
 text: string;
}

@ObjectType()
class PaginatedPosts{
@Field(()=>[Post])
posts:Post[]
@Field()
hasMore:boolean
}


@Resolver(Post)
export class PostResolver{

@FieldResolver(()=>String)
textSnippet(@Root() root:Post){
return root.text.slice(0,50)
}   

//fetch all posts
@Query(()=>PaginatedPosts)
async posts(
   @Arg('limit',()=>Int)limit:number,
   @Arg('cursor',()=>String,{nullable:true})cursor:string | null,
):Promise<PaginatedPosts>{
await sleep(0)
const reallimit=Math.min(50,limit)
const realLimitplusOne=reallimit+1

  const qb= getConnection()
    .getRepository(Post)
    .createQueryBuilder("p")
    .orderBy('"createdAt"',"DESC")
    .take(realLimitplusOne)

    if(cursor){
    qb.where('"createdAt" < :cursor', 
    { cursor:new Date(parseInt(cursor))})
    }
   const posts=await qb.getMany()
   const hasMore=posts.length===realLimitplusOne

    return {posts:posts.slice(1,reallimit),hasMore}

   }

//fetch one post by id
@Query(()=>Post,{nullable:true})
post(
@Arg('id',()=>Int) _id:number,
) :Promise<Post|null|undefined>{
   return Post.findOne(_id)
}

//create new post
@Mutation(()=>Post)
@UseMiddleware(isAuth)
async createPost(
@Arg('input')input:PostInput,
@Ctx() {req}:MyContex
) :Promise<Post>{
return Post.create(
   {...input,
   creatorId:req.session.userId,
   }
   ).save()
}

//update a post
@Mutation(()=>Post,{nullable:true})
async updatePost(
@Arg('id',()=>Int) _id:number,
@Arg('title',()=>String,{nullable:true}) title:String,
) :Promise<Post|null|undefined>{
const post= await Post.findOne(_id);
if(!post){
return null
}
if(typeof title!=="undefined"){
post.title=title
await Post.update({_id},{title})
}
 return post
}


//delete a post
@Mutation(()=>Boolean)
async deletePost(
@Arg('id',()=>Int) _id:number,
) :Promise<boolean>{
await Post.delete(_id)
return true

}



}
