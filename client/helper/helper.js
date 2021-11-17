export const validator=(field,setError)=>{
    let nameError = "";
        let passwordError = "";
        // let passwordError = "";
    
        if (!field.username) {
          nameError = "username cannot be blank";
        }

       if (!field.password) {
          passwordError = "this field cannot be empty";
        }

        if(field.password&&field.password.length<=3){
            passwordError = "password should be longer than 3 chars";
        }
  
    
        if (passwordError || nameError) {
          setError({ passwordError, nameError });
          return false;
        }else{
          setError({nameError:"",passwordError:""})
        }
    
        return true;
}
