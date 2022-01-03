import { useState } from "react"
import styles from '../styles/Register.module.css'
import { useRouter } from "next/dist/client/router";
import { useLoginUserMutation } from "../src/generated/graphql";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from './../utils/createUrqlClients';
import { loginGraphError } from "../helper/loginValidator";
import { loginValidator } from './../helper/loginValidator';
import Link from 'next/link'


function Login() {
const [input, setInput] = useState( {usernameOrEmail:"",password:""} )
const [loginError, setError] = useState({nameError:"",passwordError:""})
const router=useRouter()

const[,login]=useLoginUserMutation()
const handleChange = (evt:any) => {
    const value = evt.target.value;
    setInput({
        ...input,
        [evt.target.id]: value
      });
    };
  const handleSubmit=(e:any)=>{
      e.preventDefault()
      console.log(input)
     if( loginValidator(input,setError)){
      login(input).then(s=>{
        // console.log("mutation response",s)
        if(s.data?.loginUser.errors){
          loginGraphError(s.data?.loginUser.errors,setError)
    
        }else{

         if(typeof router.query.next==='string'){
            router.push(router.query.next)
          }
          else{
            router.push( '/')
          }
        
        }
    //    router.push('/')
      }).catch(e=>{
        // console.log("error logging in  user  ",e)
    })
     }
     else{
      // console.log("error  in  user error ")
     }

  }
return (
    <div className={styles.container}>
   
        <form className={styles.theform}>
        <h2>Login</h2>
        <div className={styles.inputgroup}>
        <label>User Name</label>
        <input
        className={loginError.nameError?styles.theinputerror:styles.theinput}
        id="usernameOrEmail"
        placeholder="username or email"
        onChange={handleChange}
        value={input.usernameOrEmail}
        />
        <span className={styles.inputerror}>
         {loginError.nameError}
         </span>
       </div>

        <div className={styles.inputgroup}>
        <label>Password</label>
        <input
        className={loginError.passwordError?styles.theinputerror:styles.theinput}
        id="password"
        placeholder="password"
        onChange={handleChange}
        value={input.password}
        required={true}
        type={"password"}
        />
        <span className={styles.inputerror}>
        {loginError.passwordError}
        </span>
      
        
        </div>
        <button className={styles.formbutton}
        onClick={handleSubmit}>Login</button>

  <Link href="/forgot-password"><a>forgot password ?</a></Link>
  <Link href="/register"><a>new here? register instead</a></Link>
        </form>
    
    </div>
    )
  }

export default withUrqlClient(createUrqlClient) (Login)
  
  