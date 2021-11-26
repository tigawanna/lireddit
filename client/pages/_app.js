import '../styles/globals.css'
// import { createClient, dedupExchange, fetchExchange, Query, Provider } from 'urql';
import { createClient, dedupExchange, fetchExchange, Query, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {whoami} from '../helper/graph'

const cache = cacheExchange({

  updates: {
    Mutation: { 
      loginUser: (result, _args, cache) => {
        console.log("logsssssssss",result.loginUser)
        cache.updateQuery({ query: whoami}, data => {
          if (result.loginUser.user !== null) {
            console.log("data in cache before ",data)
            data.Me=result.loginUser.user
            console.log("data in cache after",data)
            // data.feed.count++
            return data
          } else {
            console.log("data in cache is null")
            return null
          }
        })
      },

    },

  },

});

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions:{
  origin: 'http://localhost:3000',
  credentials:'include'
  },
  exchanges: [dedupExchange, cache, fetchExchange],
});

function MyApp({ Component, pageProps }) {
  return (
  <Provider value={client}>
    <Component {...pageProps} />
  </Provider>)
}

export default MyApp
