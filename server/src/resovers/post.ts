import {Resolver,Query,Mutation,Arg,Int, InputType, Field, Ctx, UseMiddleware} from 'type-graphql'
import { Post } from './../entities/Posts';
import { sleep } from '../utils/sleep';
import MyContex from './../types';
import { isAuth } from './../middleware/isAuth';


@InputType()
class PostInput{
 @Field()
 title: string;
 @Field()
 text: string;
}


@Resolver()
export class PostResolver{




@Query(()=>[Post])
async posts():Promise<Post[]>{
   await sleep(0)
   return Post.find()
}

@Query(()=>Post,{nullable:true})
post(
@Arg('id',()=>Int) _id:number,
) :Promise<Post|null|undefined>{
   return Post.findOne(_id)
}

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



@Mutation(()=>Boolean)
async deletePost(
@Arg('id',()=>Int) _id:number,
) :Promise<boolean>{
await Post.delete(_id)
return true

}



}
