import { useState } from "react"
import { graphError, validator } from './../helper/helper';
import styles from '../styles/Register.module.css'
import { useRegisterMutation } from "../src/generated/graphql";
import { useRouter } from "next/dist/client/router";
import { createUrqlClient } from './../utils/createUrqlClients';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link'

function Register() {
const [input, setInput] = useState( {username:"",password:"",email:""} )
const [inerror, setError] = useState({nameError:"",passwordError:"",emailError:""})
const router=useRouter()


    
const[{error},register]=useRegisterMutation()
console.log("graph ql error  ",JSON.stringify(error))
const handleChange = (evt:any) => {
    const value = evt.target.value;
    // console.log(value)
      setInput({
        ...input,
        [evt.target.id]: value
      });
    };
const handleSubmit=(e:any)=>{
    e.preventDefault()
    console.log(input)
  
   if( validator(input,setError)){
    register({options:input}).then(s=>{
    console.log("stuffing success ",s)
    if(s.data?.registerUser.errors){
     graphError(s.data?.registerUser.errors,setError)
        console.log("errors present no home")
        }else{
            console.log("lets take you home")
            router.push('/')
          }
    }).catch(e=>{
    console.log("error registering user  ",e)
    })
    }

    }
return (
    <div className={styles.container}>
   
        <form className={styles.theform}>
        <h2>Register</h2>

        <div className={styles.inputgroup}>
        <label>Email</label>
        <input
        className={inerror.passwordError?styles.theinputerror:styles.theinput}
        id="email"
        placeholder="email"
        onChange={handleChange}
        value={input.email}
        required={true}
         />
        <span className={styles.inputerror}>
        {inerror.emailError}
        </span>
         </div>


        <div className={styles.inputgroup}>
        <label>User Name</label>
        <input
        className={inerror.passwordError?styles.theinputerror:styles.theinput}
        id="username"
        placeholder="username"
        onChange={handleChange}
        value={input.username}
        />
        <span className={styles.inputerror}>
           {inerror.nameError}
         </span>
       </div>

        <div className={styles.inputgroup}>
        <label>Password</label>
        <input
         className={inerror.passwordError?styles.theinputerror:styles.theinput}
        id="password"
        placeholder="password"
        onChange={handleChange}
        value={input.password}
        required={true}
        type={"password"}
        />
        <span className={styles.inputerror}>
        {inerror.passwordError}
        </span>
         </div>

        <button className={styles.formbutton}
        onClick={handleSubmit}>Register</button>
          <Link href="/login"><a>already have an account, sign in instead ?</a></Link>
        </form>
    
    </div>
    )
  }

  export default withUrqlClient(createUrqlClient) (Register)
  
  