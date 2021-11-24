import '../styles/globals.css'
import { createClient, Provider } from 'urql';

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
