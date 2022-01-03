import { useState } from "react"
import styles from '../styles/Register.module.css'
import { useRouter } from "next/dist/client/router";
import { useForgotpasswordMutation} from "../src/generated/graphql";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from './../utils/createUrqlClients';
import { forgotValidator } from './../helper/helper';


function ForgotPassword() {
const [input, setInput] = useState( {email:""} )
const [completed, setCompleted] = useState(false)
const [myError, setError] = useState({emailError:""})
const router=useRouter()


const[{error},forgot]=useForgotpasswordMutation()
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
      if(forgotValidator(input,setError)){
     forgot(input).then(s=>{
        console.log("forgot password response  ",s)
        setCompleted(true)
    }).catch(e=>{
        console.log("forgot password error  ",e)
    })
      }
      console.log(input)
    
  }
return (
    <div className={styles.container}>
    {completed?

       <div className={styles.theform}>
         check your email to reset your password
        </div>:

        <form className={styles.theform}>
        <h2>Login</h2>
        <div className={styles.inputgroup}>
        <label>User Name</label>
        <input
        className={myError.emailError?styles.theinputerror:styles.theinput}
        id="email"
        placeholder="username or email"
        onChange={handleChange}
        value={input.email}
        />
        <span className={styles.inputerror}>
         {myError.emailError}
         </span>
       </div>
       <button className={styles.formbutton}
        onClick={handleSubmit}>Reset password</button>
        </form>
    }
    </div>
    )
  }

export default withUrqlClient(createUrqlClient) (ForgotPassword)
  
  