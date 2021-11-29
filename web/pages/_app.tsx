import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange, QueryInput,Cache } from '@urql/exchange-graphcache';
import { WHOAMI } from '../helper/graph';


function betterQuery<Result,Query>(
  cache:Cache,
  qi:QueryInput,
  result:any,
  fn:(r:Result,q:Query)=>Query
  ){
return cache.updateQuery(qi,(data)=>fn(result,data as any)as any)
}

const cache=cacheExchange({
updates:{
  Mutation: { 
    loginUser: (result, _args, cache,info) => {
     cache.updateQuery({query:WHOAMI}, data=>{
        data.value
      })
      // betterQuery(cache,{query:WHOAMI},
      //   result,
      //   (result,query)=>{

      //     if(result.loginUser.errors){
      //       return query
      //     }else{
      //       return{
      //         Me:result.loginUser.user
      //       }
      //     }
     
      //   }
      //   )
    }
  }
}
})


const client = createClient({
  url: 'http://localhost:4000/graphql',
 fetchOptions:{
  credentials:'include',
},
exchanges: [dedupExchange, cache, fetchExchange],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>)
}

export default MyApp
