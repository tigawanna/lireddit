import {MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Posts';
import { _prod } from './constants';
import path from 'path'

export default {
    migrations:{
    path: path.join(__dirname,'./migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities:[Post],
    dbName:'lireddit',
    user:'postgres',
    password:'password',
    type:'postgresql',
    debug:!_prod
} as Parameters<typeof MikroORM.init>[0]
