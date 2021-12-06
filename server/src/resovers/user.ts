import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import MyContex from "./../types";
import { User } from "./../entities/User";
import { COOKIE_NAME } from '../constants';
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from './../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import {v4} from 'uuid'
import { FORGET_PASSWORD_PREFIX } from './../constants';


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
async changePassword(
 @Arg('token') token:string,
 @Arg('newpassword') newpassword:string,
  @Ctx() {em,redis,req}: MyContex 
): Promise<UserResponse>{
  if (newpassword.length<4) {
   
    return {
      errors: [
        {
          field: "newpassword",
          message: "password too short",
        },
      ],
    };
  }
  const key=FORGET_PASSWORD_PREFIX+token
  const userID=await redis.get(key)
  if(!userID){
    return {
      errors: [
        {
          field: "token",
          message: "token expired",
        },
      ],
    };
  }

  const user=await em.findOne(User,{_id:parseInt(userID)})

  if(!user){
    return {
      errors: [
        {
          field: "token",
          message: "user no longer exists",
        },
      ],
    };
  }

user.password=await argon2.hash(newpassword);
    await em.persistAndFlush(user)

   redis.del(key) 
//login user after password reset
// req.session.userId=user._id
return{
  user
}

}
 
@Mutation(()=>Boolean)
async forgotPassword(
  @Arg('email') email:string,
  @Ctx() {em,redis}: MyContex 
){
const user=await em.findOne(User,{email})
if(!user){
  console.log("no such email found")
  return true
}

const token=v4();
await redis.set(FORGET_PASSWORD_PREFIX+token,
  user._id,
  'ex',
  1000*60*60*24*3 //3days
  )

await sendEmail(email,
  `<a href="http://localhost:3000/change-password/${token}">reset apssword</a>`)

return true
}

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em,req }: MyContex
  ): Promise<UserResponse> {
  const errors= validateRegister(options)
  if(errors){
    return {errors}
  }
    const hashedPassword = await argon2.hash(options.password);
    
    const  user = await em.create(User, {
      username: options.username,
      password: hashedPassword,
      email:options.email,
      createdAt:new Date(),
      updatedAt:new Date()
    });

    try {
      await em.persistAndFlush(user);
     } catch (e) {
      console.log("an error occured  ", e.constraint);
      if (e.constraint==="user_username_unique") {
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
      if (e.constraint==="user_email_unique") {
        console.log("email exist");
        return {
          errors: [
            {
              field: "email",
              message: "that email is already taken",
            },
          ],
        };
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
  @Arg('usernameOrEmail') usernameOrEmail:string,
  @Arg('password') password:string,
    @Ctx() { em,req }: MyContex
  ): Promise<UserResponse> {
    const method= usernameOrEmail.includes('@')?"email":"username"
    
    const user = await em.findOne(User, 
       usernameOrEmail.includes('@')?
       {email:usernameOrEmail}:{username:usernameOrEmail}
       );
    console.log("user tried to ogin ",user)   
    if (!user) {
      if(method==="username"){
        return {
          errors: [
            {
              field: "username",
              message: "that username doesn't exist in our records",
            },
          ],
        };
      }

      if(method==="email"){
        return {
          errors: [
            {
              field: "email",
              message: "that email doesn't exist in our records",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "username",
            message: "that doesn't exist in our records",
          },
        ],
      };

    }
    const valid = await argon2.verify(user.password,password);
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






