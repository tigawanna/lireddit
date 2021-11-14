import { EntityManager,IDatabaseDriver,Connection } from '@mikro-orm/core';

 type MyContex ={
    em:EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}

export default MyContex