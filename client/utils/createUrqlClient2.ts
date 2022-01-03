import { createClient, dedupExchange, fetchExchange,  stringifyVariables, } from 'urql';
import { cacheExchange, Resolver} from '@urql/exchange-graphcache';
import { LoginUserMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../src/generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';




const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    console.log("all fields  ",allFields)
    if (size === 0) {
      return undefined;
    }

    // const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // const isItInTheCache = cache.resolve(
    //   cache.resolveFieldByKey(entityKey, fieldKey) as string,
    //   "posts"
    // );
    // info.partial = !isItInTheCache;
    // let hasMore = true;
    // const results: string[] = [];
    // fieldInfos.forEach((fi) => {
    //   const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
    //   const data = cache.resolve(key, "posts") as string[];
    //   const _hasMore = cache.resolve(key, "hasMore");
    //   if (!_hasMore) {
    //     hasMore = _hasMore as boolean;
    //   }
    //   results.push(...data);
    // });

    // return {
    //   __typename: "PaginatedPosts",
    //   hasMore,
    //   posts: results,
    // };
  };
};

 const cache=cacheExchange({
  // keys: {
  //   PaginatedPosts: () => null,
  // },
  resolvers: {
    Query: {
      posts: cursorPagination(),
    },
  },
    updates:{
      Mutation: { 
        loginUser: (_result, args, cache, info) => {
          betterUpdateQuery<LoginUserMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
           // @ts-ignore
              (result, query) => {
              if (result.loginUser.errors) {
                return query;
              } else {
                return {
                 Me:result.loginUser.user
                };
              }
            },
          );
      
        },
        registerUser: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
             // @ts-ignore
                (result, query) => {
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                   Me:result.registerUser.user
                  };
                }
              },
            );
        },
        logoutUser:(_result, args, cache, info)=>{
        betterUpdateQuery<LogoutMutation,MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({Me:null})
              )}
      }
    }
    })
    
    
     export const client = createClient({
      url: 'http://localhost:4000/graphql',
     fetchOptions:{
      credentials:'include',
    },
    exchanges: [dedupExchange, cache, fetchExchange],
    });