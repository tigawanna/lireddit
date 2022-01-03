
import { dedupExchange, fetchExchange,stringifyVariables } from 'urql';
import { cacheExchange, Resolver} from '@urql/exchange-graphcache';
import { DeletePostMutationVariables, LoginUserMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from '../src/generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router'
import { gql } from 'graphql-tag';
import { isServer } from './isServer';




const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;

    if (size === 0) {
      return undefined;
    }

    
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
 
  };

const errorExchange: Exchange = ({ forward }) => ops$ => {

return pipe(
    forward(ops$),
    tap(({ error }) => {
      // console.log("global error in exchange  ", error)
      // If the OperationResult has an error send a request to sentry
      if (error?.message.includes("no user logged in")) {
        // the error is a CombinedError with networkError and graphqlErrors properties
      Router.replace("/login")
      }

    })
  );
};

 const cache=cacheExchange({
   keys:{
   PaginatedPosts:()=>null,
   },
  resolvers: {
    Query: {
      posts: cursorPagination(),
    },
  },
    updates:{
      Mutation: { 
        deletePost:(_result, args, cache, info)=>{
        cache.invalidate({__typename:'Post',
       _id:(
         args as DeletePostMutationVariables
         ).id})
        },
        vote: (_result, args, cache, info) => {
          const { postId, value } = args as VoteMutationVariables;
          const data = cache.readFragment(
            gql`
              fragment _ on Post {
                _id
                points
                voteStatus
              }
            `,
            { _id: postId } as any
          );

          if (data) {
            if (data.voteStatus === value) {
              return;
            }
            const newPoints =
              (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
            cache.writeFragment(
              gql`
                fragment __ on Post {
                  points
                  voteStatus
                }
              `,
              { _id: postId, points: newPoints, voteStatus: value } as any
            );
          }
        },
        createPost: (_result, args, cache, info) => {
          const allFields = cache.inspectFields("Query");
          const fieldInfos = allFields.filter(
            (info) => info.fieldName === "posts"
          );
          fieldInfos.forEach((fi) => {
            cache.invalidate("Query", "posts", fi.arguments || {});
          });
        },
   
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

export const createUrqlClient=(ssrExchange:any,ctx:any)=>{
  let cookie=''

  if(isServer()){
    cookie=ctx?.req.headers.cookie
  }

  return({
    url: 'http://localhost:4000/graphql',
    fetchOptions:{
     credentials:'include' as const,
     Headers:cookie?{
     cookie
     }:undefined
   },
   exchanges: [dedupExchange, cache,ssrExchange,errorExchange,fetchExchange],
}) }