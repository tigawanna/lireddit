import { EntityManager,IDatabaseDriver,Connection } from '@mikro-orm/core';
import {Request,Response} from 'express'
import { Session } from 'express-session';




 type MyContex ={
    em:EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: Session };
    res: Response;
}
declare module 'express-session' {
    interface Session {
       userId: number;
       user:Object
     }
   }
export default MyContex


