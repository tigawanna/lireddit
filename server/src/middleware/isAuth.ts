import { MiddlewareFn } from "type-graphql";
import MyContex from './../types';

export const isAuth:MiddlewareFn<MyContex>=({context},next)=>{
    if(!context.req.session.userId){
        throw new Error('no user logged in')
     }

     return next();
}