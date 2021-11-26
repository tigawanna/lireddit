import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import { useMutation,useQuery ,gql} from 'urql';
import { whoami } from '../helper/graph';

function Navbar() {

    const [result, reexecuteQuery] = useQuery({
        query: whoami,
        
     });
    const { data, fetching, error } = result;
      if (fetching) return <p>Loading...</p>;
      if (error) return <p>Oh no... {error.message}</p>;
      console.log(data)

  return (
  <div className={styles.container}>
    <div className={styles.logosection}>
    <h3>logo</h3>
   </div>
    <div className={styles.mainbar}>
    <h3>Lireddit</h3>
   </div>
 
   <div className={styles.authlinks}>
   {data.Me?<div className={styles.authlinks}>
   <h3 className={styles.authlinks}>Welcome {data?.Me?.username}</h3>
   <div>logout</div>
   </div>
   :
   <div className={styles.authlinks}>
   <div className={styles.links}>
   <Link href="/login"><a>Login</a></Link>
   </div>
   <div className={styles.links}> 
   <Link href="/register" ><a>Register</a></Link>
   </div>
   </div>}
 
   </div>
 
  
  </div>
  )
}

export default Navbar