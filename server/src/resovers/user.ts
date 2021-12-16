import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Field,
  ObjectType,
  Query,
  FieldResolver,
  Root,
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
import { getConnection } from "typeorm";


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

@Resolver(User)
export class UserResolver {

  
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContex) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user._id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }


@Query(()=>User,{nullable:true})
Me(
  @Ctx() { req }: MyContex
){
  console.log("from me query",req.session.userId)
  if(!req.session.userId){
    console.log("you're not logged in")
    return null
  }
return User.findOne(req.session.userId)

}

@Mutation(() => UserResponse)
async changePassword(
 @Arg('token') token:string,
 @Arg('newpassword') newpassword:string,
  @Ctx() {redis}: MyContex 
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
const useridNum=parseInt(userID)
 const user=await User.findOne(useridNum)

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
await User.update({_id:useridNum},
      {password:await argon2.hash(newpassword)})

   redis.del(key) ;
//login user after password reset
// req.session.userId=user._id
return{
  user
}

}


 
@Mutation(()=>Boolean)
async forgotPassword(
  @Arg('email') email:string,
  @Ctx() {redis}: MyContex 
){
const user=await User.findOne({where :{email}})
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
    @Ctx() { req }: MyContex
  ): Promise<UserResponse> {
  const errors= validateRegister(options)
  if(errors){
    return {errors}
  }
    const hashedPassword = await argon2.hash(options.password);
    
    let user;
    try {
      // User.create({
      //   username: options.username,
      //   password: hashedPassword,
      //   email:options.email,
      // }).save()

    const result =await getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(
      {
        username: options.username,
        password: hashedPassword,
        email:options.email,
      }
    )
    .returning('*')
    .execute()
    user=result.raw[0]
    // console.log("returning result  ",result)
   
     } catch (e) {
      console.log("an error occured  ", e);
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
    @Ctx() { req }: MyContex
  ): Promise<UserResponse> {
    const method= usernameOrEmail.includes('@')?"email":"username"
    
    const user = await User.findOne( 
       usernameOrEmail.includes('@')?
       {where:{email:usernameOrEmail}}:{where: {username:usernameOrEmail}}
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






