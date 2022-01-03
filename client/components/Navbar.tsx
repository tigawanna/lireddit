import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import { useLogoutMutation, useMeQuery } from '../src/generated/graphql';
import { isServer } from './../utils/isServer';
function Navbar() {

    const [result] = useMeQuery({
      pause:isServer()
    });
    const { data, fetching, error } = result;

    const [{fetching:isWorking},logout]=useLogoutMutation()
    const logoutUser=()=>{
        logout().then(s=>{
            console.log('succefully logged out ',s)
        }).catch(e=>{
            console.log("error logging out ",e)
        })
    }
    
      if (fetching) return (
     <div className={styles.container}>
        <div className={styles.logosection}>
        <h3>logo</h3>
       </div>
       <div className={styles.mainbar}>
       <h3>Lireddit</h3>
        </div>
       <div className={styles.authlinks}>
       <p>loading...</p>
       </div>
       </div>
      )
      if (error) return  (
         <div className={styles.container}>
         <div className={styles.logosection}>
         <h3>logo</h3>
        </div>
        <div className={styles.mainbar}>
        <h3>Lireddit</h3>
         </div>
        <div className={styles.authlinks}>
        <p>Oh no... {error.message}</p>
        </div>
        </div>
        )
       


  return (
    <div className={styles.container}>
    <div className={styles.logosection}>
    <div> 
   <Link href="/" ><a>LOGO</a></Link>
   </div>
   </div>
    <div className={styles.mainbar}>
    <h3>Lireddit</h3>
    </div>

 
   <div className={styles.authlinks}>
   {data?.Me?<div className={styles.authlinks}>
   <h3 className={styles.authlinks}>Welcome {data?.Me?.username}</h3>
   {isWorking?<div>...</div>:<button onClick={()=>logoutUser()}>logout</button>}
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