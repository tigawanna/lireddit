export const changepwValidator=(field:any,setError:any)=>{
    let newpw = "";
    let confirmnewpw = "";
  

    if (!field.newpw) {
      newpw = "enter username or email";
    }

   if (!field.confirmnewpw) {
      confirmnewpw = "this field cannot be empty";
    }


    if(field.confirmnewpw&&field.confirmnewpw.length<=3){
        confirmnewpw = " password should be longer than 3 chars";
    }
    if(field.confirmnewpw !== field.newpw){
        confirmnewpw = "not a match";
    }


    if (confirmnewpw || newpw ){
      console.log("errors below")
      console.log(confirmnewpw, newpw)
      setError({ passwordError: confirmnewpw, nameError: newpw});
      return false;
    }else{
      setError({nameError:"",passwordError:""})
    }

    return true;
}

export const changepwGraphError=(field:any,setError:any)=>{

const theerror=field;
if(theerror!==undefined){
  const newerror =theerror[0]
  if(newerror){
  if(newerror.field==="token"){
    setError({otherError:newerror.message})
  }


  }
  console.log(newerror.field)

 }
 else{
   console.log("nope")
 }
//  setError()

}