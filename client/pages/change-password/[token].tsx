import { NextPage } from "next"
import { useState } from "react"
import styles from '../../styles/Register.module.css'
import { useRouter } from "next/dist/client/router";
import { useChangePasswordMutation, useLoginUserMutation } from "../../src/generated/graphql";
import { changepwGraphError, changepwValidator } from './../../helper/changepasswordValidator';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../../utils/createUrqlClients";
import Link from 'next/link'



const Changepassword: NextPage<{token:string}>=({})=>{

const [input, setInput] = useState( {confirmnewpw:"",newpw:""} )
const [loginError, setError] = useState({nameError:"",passwordError:""})
const router=useRouter()


const[{error},changePw]=useChangePasswordMutation()

console.log("error with use mutation",error)

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
  if(changepwValidator(input,setError)){
   console.log("all good")

   changePw({newpassword:input.newpw,
    token:typeof router.query.token==='string'?router.query.token:""
  })
   .then(s=>{
       console.log("change password response  ",s)
       if(s.data?.changePassword.errors){
        changepwGraphError(s.data?.changePassword.errors,setError)
        console.log("errors present no home")
      }else{
        console.log("lets take you home")
        router.push('/login')
      }
   })
   .catch(e=>{
       console.log("error changing apssword ",e)
   })

  }else{
      console.log("error  in  user error ")
     }

  }
return(
    <div className={styles.container}>
   
        <form className={styles.theform}>
        <h2>Reset pasword</h2>
        <div className={styles.inputgroup}>
        <label>New Passwoord</label>
        <input
        className={loginError.nameError?styles.theinputerror:styles.theinput}
        id="newpw"
        placeholder="enter new password"
        onChange={handleChange}
        value={input.newpw}
        type={"password"}
        />
        <span className={styles.inputerror}>
         {loginError.nameError}
         </span>
       </div>

        <div className={styles.inputgroup}>
        <label>Confirm Password</label>
        <input
        className={loginError.passwordError?styles.theinputerror:styles.theinput}
        id="confirmnewpw"
        placeholder="confirm password"
        onChange={handleChange}
        value={input.confirmnewpw}
        required={true}
        type={"password"}
        />
        <span className={styles.inputerror}>
        {loginError.passwordError}
        </span>
      
        
        </div>
        <button className={styles.formbutton}
        onClick={handleSubmit}>Change Password</button>

   {loginError.passwordError.includes('token')?
   <Link href="/forgot-password"><a>try again</a></Link>:null}
        </form>
    
    </div>
)
}


export default withUrqlClient(createUrqlClient)(Changepassword)