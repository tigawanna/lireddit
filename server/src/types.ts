import { EntityManager,IDatabaseDriver,Connection } from '@mikro-orm/core';
import {Request,Response} from 'express'
import { Session } from 'express-session';
import { Redis } from 'ioredis';




 type MyContex ={
    em:EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: Session };
    res: Response;
    redis:Redis;
}
declare module 'express-session' {
    interface Session {
       userId: number;
       user:Object,
       deeznuts:String,

     }
   }
export default MyContex


