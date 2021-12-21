import {Resolver,Query,Mutation,Arg,Int, InputType,
    Field, Ctx, UseMiddleware, FieldResolver, Root,ObjectType} from 'type-graphql'
import { Post } from './../entities/Posts';
import { sleep } from '../utils/sleep';
import MyContex from './../types';
import { isAuth } from './../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Updoot } from './../entities/Updoot';



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
const reaLimitPlusOne=reallimit+1

const replacements: any[] = [reaLimitPlusOne];

if (cursor) {
  replacements.push(new Date(parseInt(cursor)));
}

const posts = await getConnection().query(
  `
select p.*,
json_build_object(
   '_id',u._id,
   'username', u.username,
   'email', u.email,
   'updateAt', u."updatedAt",
   'createdAt', u."createdAt"
   ) creator
from post p
inner join public.user u on u._id=p."creatorId"
${cursor ? `where p."createdAt" < $2` : ""}
order by p."createdAt" DESC
limit $1
`,
  replacements
);

// console.log("posts from query  ======= ",posts)
// posts&&posts.map((pst: any)=>{
   // console.log("posts from query  ======= ",posts)
// })


const hasMore=posts.length===reaLimitPlusOne
return {
   posts:posts.slice(0,reallimit),
   
   hasMore}

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

@Mutation(()=>Boolean)
// @UseMiddleware(isAuth)
async vote(
   @Arg('postId',()=>Int) postId:number,
   @Arg('value',()=>Int) value:number,
   @Ctx() {req}:MyContex

){

const isUpdoot=value!==-1 
const realvalue=isUpdoot ? 1:-1
const userId=req.session.userId?req.session.userId:1

const updoot=await Updoot.findOne({postId,userId})  
//user has voted on the post before
//and is changing the vote
if(updoot&&updoot.value!==realvalue){
   await getConnection().transaction(async tm=>{
   await tm.query(`
update  updoot 
set value=$1
where "userId"=$2 and "postId"=$3
`,
[realvalue,userId,postId,]);

await tm.query(`
update  post
set points=points+$1
where "_id"=$2
`,
//multiply real value times two because 1 down vote shoud be -1 buut 1 = -1 =0
[2*realvalue,postId,]);

   })
}
//hasn'tvvoted before
else if(!updoot){

await getConnection().transaction(async tm=>{

await tm.query(`
insert into updoot ("userId","postId",value)
values($1,$2,$3);`,
[userId,postId,realvalue]);

await tm.query(`
update post 
set points=points+$1
where _id=$2;
`,[realvalue,postId]);

})
}


return true
}



}
