import { useState } from "react"
import { validator } from './../helper/helper';
import styles from '../styles/Register.module.css'

function Register() {
const [input, setInput] = useState( {username:"",password:""} )
const [error, setError] = useState({nameError:"",passwordError:""})

const handleChange = (evt) => {
    const value = evt.target.value;
    console.log(value)
      setInput({
        ...input,
        [evt.target.id]: value
      });
    };
const handleSubmit=(e)=>{
    e.preventDefault()
    console.log(input)
    // handleVlidate(input,setError)
    validator(input,setError)
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
        minLength={4}
        maxLength={5}
        onChange={handleChange}
        value={input.username}
        />
        <span className={styles.inputerror}>
           {error.nameError}
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
        {error.passwordError}
        </span>
      
        
        </div>
        <button className={styles.formbutton}
        onClick={handleSubmit}>test</button>
        </form>
    
    </div>
    )
  }

  export default  Register
  
  