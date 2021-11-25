import '../styles/globals.css'
import { createClient, dedupExchange, fetchExchange, Query, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {whoami} from '../helper/graph'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions:{
  origin: 'http://localhost:3000',
  credentials:'include'
}
});

function MyApp({ Component, pageProps }) {
  return (
  <Provider value={client}>
    <Component {...pageProps} />
  </Provider>)
}

export default MyApp
