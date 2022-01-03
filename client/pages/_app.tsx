import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from './../components/Navbar';
import styles from '../styles/App.module.css'
import { createUrqlClient } from './../utils/createUrqlClients';
import { withUrqlClient } from 'next-urql';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
    <div className={styles.navbar}>
    <Navbar/>
    </div>
    <div className={styles.main}>
    <Component {...pageProps} />
    </div>
    </div>
 )
}

export default withUrqlClient(createUrqlClient) (MyApp)
