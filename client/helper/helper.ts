export const validator=(field:any,setError:any)=>{
        let nameError = "";
        let passwordError = "";
        let emailError = "";
    
        if (!field.username) {
          nameError = "username cannot be blank";
        }

       if (!field.password) {
          passwordError = "this field cannot be empty";
        }

        if (!field.email) {
          emailError = "this field cannot be empty";
        }

        if (field.email&&!field.email.includes('@')) {
          emailError = "email must include the @ symbol";
        }

        if(field.password&&field.password.length<=3){
            passwordError = "password should be longer than 3 chars";
        }
  
    
        if (passwordError || nameError||emailError) {
          console.log("errors below")
          console.log(passwordError, nameError,emailError )
          setError({ passwordError, nameError,emailError });
          return false;
        }else{
          setError({nameError:"",passwordError:"",emailError:""})
        }
    
        return true;
}

export const graphError=(field:any,setError:any)=>{

const theerror=field;
   if(theerror!==undefined){
      const newerror =theerror[0]
      if(newerror){
      if(newerror.field==="username"){
        setError({nameError:newerror.message})
      }
      if(newerror.field==="email"){
        setError({emailError:newerror.message})
      }
      if(newerror.field==="password"){
        setError({passwordError:newerror.message})
      }
      }
      console.log(newerror.field)

     }
     else{
       console.log("nope")
     }
    //  setError()
   }

   export const forgotValidator=(field:any,setError:any)=>{
   let emailError = "";
  
   if (!field.email) {
      emailError = "this field cannot be empty";
    }

    if (field.email&&!field.email.includes('@')) {
      emailError = "email must include the @ symbol";
    }

     if (emailError) {
      console.log("errors below")
      setError({emailError });
      return false;
    }else{
      setError({emailError:""})
    }

    return true;
}