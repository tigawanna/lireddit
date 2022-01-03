export const loginValidator=(field:any,setError:any)=>{
    let nameError = "";
    let passwordError = "";
  

    if (!field.usernameOrEmail) {
      nameError = "enter username or email";
    }

   if (!field.password) {
      passwordError = "this field cannot be empty";
    }


    if(field.password&&field.password.length<=3){
        passwordError = " password should be longer than 3 chars";
    }


    if (passwordError || nameError ){
      console.log("errors below")
      console.log(passwordError, nameError)
      setError({ passwordError, nameError});
      return false;
    }else{
      setError({nameError:"",passwordError:""})
    }

    return true;
}

export const loginGraphError=(field:any,setError:any)=>{

const theerror=field;
if(theerror!==undefined){
  const newerror =theerror[0]
  if(newerror){
  if(newerror.field==="username"){
    setError({nameError:newerror.message})
  }
  if(newerror.field==="email"){
    setError({nameError:newerror.message})
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