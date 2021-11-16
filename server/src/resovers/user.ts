import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
import MyContex from "./../types";
import { User } from "./../entities/User";

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


  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContex
  ): Promise<UserResponse>{

      if(options.username.length<=2){
          return{
        errors:[{
         field:"username",
         message:"username length must be greater than 2"
              }]
          }
        }
        if(options.password.length<=3){
            return{
         errors:[{
           field:"password",
           message:"password length must be greater than 3"
                }]
            }
          }
          const hashedPassword = await argon2.hash(options.password);
          const user = await em.create(User, {
              username: options.username,
              password: hashedPassword,
          })

      try{
    em.persistAndFlush(user);
          return {
            user,
          };
      }
      catch(e){
          console.log("an error occured  ",e)
          console.error(e.message)
          return{
            errors:[{
              field:"password",
              message:"some error occured"
                   }]
               }
      }
 
 
    }


  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContex
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username doesnt exits",
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
    return {
      user,
    };
  }
}
