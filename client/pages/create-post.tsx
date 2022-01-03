import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from './../utils/createUrqlClients';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import styles from '../styles/Posts.module.css'
import { postValidator } from '../helper/postvalisator';
import { useCreatePostMutation, useMeQuery } from './../src/generated/graphql';
import { useIsAuth } from './../utils/isAuth';


function CreatePost() {
    const [input, setInput] = useState( {title:"",text:""} )
    const [postError, setError] = useState({textError:"",titleError:"",otherError:""})
    const router=useRouter()
    const[,createPost]=useCreatePostMutation()
    
    //to check idf authed before posting
    useIsAuth()


  const handleChange = (evt:any) => {
    const value = evt.target.value;
    setInput({
        ...input,
        [evt.target.id]: value
      });
    };

 
const handleSubmit=(e:any)=>{
      e.preventDefault()
      // console.log(input)
      if(postValidator(input,setError)){
        createPost({input})
        .then(s=>{
          console.log("create post response ",s)
          if(s.error){
            setError({...postError,otherError:s.error.message})
          }else{
            // router.push('/')
          }
          
        })
        .catch(e=>{
          console.log("create post error ",e)
        })
      }
     
  
  }


    return (
        <div className={styles.container}>
         <form className={styles.theform}>

        <h3>Whats on your mind?</h3>
        <div className={styles.inputgroup}>
       <input
        className={postError.titleError?styles.titleinputerror:styles.titleinput}
        id="title"
        placeholder="title"
        onChange={handleChange}
        value={input.title}
        required={true}
        />
        <span className={styles.inputerror}>
         {postError.titleError}
         </span>
       </div>

        <div className={styles.inputgroup}>
        <input
        className={postError.textError?styles.textinputerror:styles.textinput}
        id="text"
        placeholder="add details"
        onChange={handleChange}
        value={input.text}
        required={true}
     
        />
        <span className={styles.inputerror}>
        {postError.textError}
        </span>
      
        
        </div>
        <button className={styles.formbutton}
        onClick={handleSubmit}>Post</button>


      {postError.otherError?<div className={styles.errorbanner}>
      {postError.otherError}
       </div>:null}
      </form>

      
    
    </div>
   )
  }
  
  export default withUrqlClient(createUrqlClient) (CreatePost)