export const postValidator=(field:any,setError:any)=>{
    let titleError = "";
    let textError = "";
   
if (!field.title) {
      titleError = "title cannot be blank";
    }

   if (!field.text) {
      textError = "this field cannot be empty";
    }


if (titleError || textError) {
      console.log("errors below")
      console.log(titleError, textError)
      setError({ titleError, textError });
      return false;
    }else{
      setError({titleError:"",textError:""})
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

