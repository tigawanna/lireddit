import type { NextPage } from 'next'
import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../src/generated/graphql';
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Navbar from './../components/Navbar';
import { createUrqlClient } from './../utils/createUrqlClients';
import { useState } from 'react';
import Post from '../components/Post';
import { GoPlus } from 'react-icons/go';
import { IconContext } from 'react-icons/lib';

const Home: NextPage = () => {
  const [variables,setVariables]=useState({limit:10,
    cursor:null as string|null|undefined})

  const [{data, fetching, error }]=usePostsQuery({
    variables
  })

  // console.log(data,error)

 

  if(!data&&fetching){
    return (
      <div className={styles.container}>
       <div className={styles.main}>
        <h1>loading...</h1>
        </div>
         </div>
    )
  }

 if(error){
    return (
      <div className={styles.container}>
      <div className={styles.main}>
        <h1>ERROR</h1>
        </div>
         </div>
    )
  }

  return (
  <div className={styles.container}>
 <div className={styles.header}> <h1>Home page</h1></div>
  <div className={styles.main}>
     {!data?null:data.posts.posts.map((m)=>{
       
     return(
       <Post m={m} key={m._id}/>
       )
     })}
    <div className={styles.createpost}> 
   <Link href="/create-post" ><a>
       <IconContext.Provider value={
        { size:"45px" ,style:{margin:"2px"}}
        }>
      <GoPlus/>
      </IconContext.Provider>
      </a></Link>
   </div>
     </div>   
     <div className={styles.loadmore}>
     {data?.posts.hasMore?<button 
     className={styles.loadmorebtn}
     onClick={()=>setVariables({
       limit:variables.limit,
       cursor:data?.posts.posts[data.posts.posts.length-1].createdAt
     })}
     >load more</button>:null}
     </div>
    </div>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:true}) (Home)
