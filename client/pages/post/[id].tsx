import styles from '../../styles/APost.module.css'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from './../../utils/createUrqlClients';
import { useRouter } from 'next/dist/client/router';
import { usePostQuery } from '../../src/generated/graphql';

 const Post = ({}) => {
     const router=useRouter()
     const intId=typeof router.query.id==='string' ?parseInt(router.query.id):-1;
     console.log(intId)
     const[{data,fetching,error}]= usePostQuery(
         {
             pause:intId===-1,
             variables:{
                 //@ts-ignore
                 postId:intId
             }
         }
     )
     console.log(data,error)

    if(error){
    <div className={styles.container}>
       {error.message}
        </div>
              
     }

if(fetching){
        <div className={styles.container}>
       ...loadung
        </div>
              
     }
return (
    <div className={styles.container}>
    <h1>{data?.post?.title}</h1>
    {data?.post?.text}
    </div>
        );
}
export default withUrqlClient(createUrqlClient,{ssr:true})( Post)