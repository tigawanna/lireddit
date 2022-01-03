import styles from '../styles/Post.module.css'
import {ImArrowDown, ImArrowUp} from 'react-icons/im';
import {FaTrash} from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { useState } from 'react';
import { PostSnippetFragment, useDeletePostMutation, useVoteMutation} from './../src/generated/graphql';
import dayjs from 'dayjs';
import Link from 'next/link'


interface PostProps{
    m:PostSnippetFragment
}

 const Post:React.FC<PostProps>=({m}) =>{
    const [up,setUp]=useState(false)
    const [down,setDown]=useState(false)
    const [,vote]=useVoteMutation()
    const [,deletePost]=useDeletePostMutation()

    // if(m.points>0){
    //     setUp(true)
    //  }else if(m.points<0){
    //     setDown(true)
    
    // }
    // console.log("vote mutation response============",data,error)
    const upcolor=up||m.voteStatus&&m.voteStatus===1?"brown":"#fff"
    const downcolor=down||m.voteStatus&&m.points===-1?"brown":"#fff"

    // console.log(dayjs(new Date(parseInt(m.createdAt))).format('D MMM , YYYY h:mm A'))
    // dayjs().format(m.createdAt)

    // console.log(new Date(parseInt(m.createdAt)).toLocaleString())

    const upvote=()=>{
    vote({postId:m._id,value:1})
    setUp(true);setDown(false)
    }
    const downvote=()=>{
        vote({postId:m._id,value:-1})
        setUp(false);setDown(true)
    }

return (
   <div  key={m._id} className={styles.card}>

    <div className={styles.cardheader}>
    <div className={styles.cardheaderid}>#{m._id}</div>  

    <div className={styles.cardheaderid}>{  
   dayjs(new Date(parseInt(m.createdAt))).format('D MMM , YYYY h:mm A')
    }</div>  
    <div className={styles.cardheaderuser}>by: {m.creator.username} </div>
    </div>
    <div className={styles.cardmiddle}>
    <div className={styles.cardmiddlestart}>
        <FaTrash onClick={()=>{
        deletePost({id:m._id})
        .then(e=>console.log("delete post respose======= ",e))
        }}/>
    </div>

<Link
href="/post/[id]"
as={`/post/${m._id}`}

>
<div className={styles.cardmiddlecenter}>
    <h3>{m.title} </h3>
    <p> {m.textSnippet}</p>
    </div>
</Link>


    <div className={styles.cardmiddleend}>

    <div className={styles.updoots}>{m.points}</div> 

    <IconContext.Provider value={
        { color:upcolor,size:"25px",style:{margin:"2px"}}
        }>
    <ImArrowUp 
    onClick={()=>upvote()}
    /> 

     </IconContext.Provider>
        
     <IconContext.Provider value={
        { color:downcolor,size:"25px" ,style:{margin:"2px"}}
        }>
     <ImArrowDown
      onClick={()=>{downvote()}}
     /> 
     </IconContext.Provider>
        
        </div>
     </div>
      </div>

  )
}

export default Post