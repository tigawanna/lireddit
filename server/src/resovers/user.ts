import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import MyContex from "./../types";
import { User } from "./../entities/User";
import { COOKIE_NAME } from '../constants';





@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {

@Query(()=>User,{nullable:true})
async Me(
  @Ctx() { req ,em}: MyContex

){
  if(!req.session.userId){
    console.log("you're not logged in")
    return null
  }
  const user=await em.findOne(User,{_id:req.session.userId})
  return user
}


  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em,req }: MyContex
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username length must be greater than 2",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
     
      return {
        errors: [
          {
            field: "password",
            message: "password length must be greater than 3",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
     } catch (e) {
      console.log("an error occured  ", e);
      if (e.detail.includes("already exists")) {
        console.log("username exist");
        return {
          errors: [
            {
              field: "username",
              message: "that username is already taken",
            },
          ],
        };
      }
      else{
          console.log("something is wrong with the register user mutation",e)
      }
    }
   //set cookie to keep user logged in
    req.session.userId=user._id
    return {
      user,
    };
  }



  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em,req }: MyContex
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist in our records",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password incorrect",
          },
        ],
      };
    }
    req.session.userId=user._id
   return {
      user,
    };
  }

 @Mutation(() => Boolean)
  logoutUser(@Ctx() { req,res }: MyContex){
   return new Promise (resolve=>req.session.destroy(err=>{
    res.clearCookie(COOKIE_NAME)
    if(err){
      console.log("error clearing redis session",err)
      resolve(false)
      return
    }
     resolve(true)
  }))
  
  }

}






