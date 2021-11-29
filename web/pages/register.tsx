// @ts-nocheck

import { useState } from "react"
import { validator } from './../helper/helper';
import styles from '../styles/Register.module.css'
import { useRegisterMutation } from "../src/generated/graphql";

function Register() {
const [input, setInput] = useState( {username:"",password:""} )
const [inerror, setError] = useState({nameError:"",passwordError:""})



    
const[{error},register]=useRegisterMutation()
console.log("graph ql error  ",JSON.stringify(error))
const handleChange = (evt) => {
    const value = evt.target.value;
    // console.log(value)
      setInput({
        ...input,
        [evt.target.id]: value
      });
    };
const handleSubmit=(e)=>{
    e.preventDefault()
    console.log(input)
//    if( validator(input,setError)){
//     register(input)
//     }
   register(input).then(s=>{
       console.log("stuffing success ",s.data.registerUser)
   }).catch(e=>{
       console.log("error registering user  ",e)
   })
    }
return (
    <div className={styles.container}>
   
        <form className={styles.theform}>
        <h2>Register</h2>
        <div className={styles.inputgroup}>
        <label>User Name</label>
        <input
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
        onClick={handleSubmit}>test</button>
        </form>
    
    </div>
    )
  }

  export default  Register
  
  