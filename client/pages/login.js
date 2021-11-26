import { useState } from "react"
import styles from '../styles/Register.module.css'
import { useMutation,gql } from "urql";
import { graphError, validator } from './../helper/helper';
import { useRouter } from "next/dist/client/router";


function Login() {
const [input, setInput] = useState( {username:"",password:""} )
const [loginError, setError] = useState({nameError:"",passwordError:""})
const router=useRouter()

const LOGIN_MUTATION=gql`
mutation loginUser($username:String!,$password:String!){
  loginUser(options:{username:$username,password:$password}) {
    user{
      username
    }
    errors {
        field
        message
      }
  }
}
`
const[{error},login]=useMutation(LOGIN_MUTATION)
console.log("error with use mutation".error)
const handleChange = (evt) => {
    const value = evt.target.value;
    setInput({
        ...input,
        [evt.target.id]: value
      });
    };
    const handleSubmit=(e)=>{
      e.preventDefault()
      console.log(input)
     if( validator(input,setError)){
      login(input).then(s=>{
        console.log("stuffing success ",s)
        // if(s.data.loginUser.errors){
        //   graphError(s.data.loginUser.errors,setError)
        //   console.log("errors present no home")
        // }else{
        //   console.log("lets take you home")
        //   router.push('/')
        // }
                  router.push('/')
      }).catch(e=>{
        console.log("error logging in  user  ",e)
    })
     }

  }
return (
    <div className={styles.container}>
   
        <form className={styles.theform}>
        <h2>Login</h2>
        <div className={styles.inputgroup}>
        <label>User Name</label>
        <input
        id="username"
        placeholder="username"
        minLength={4}
        maxLength={5}
        onChange={handleChange}
        value={input.username}
        />
        <span className={styles.inputerror}>
           {loginError.nameError}
         </span>
       </div>

        <div className={styles.inputgroup}>
        <label>Password</label>
        <input
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
        onClick={handleSubmit}>test</button>
        </form>
    
    </div>
    )
  }

  export default  Login
  
  