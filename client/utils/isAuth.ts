import { useMeQuery } from "../src/generated/graphql";
import { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

export const useIsAuth=()=>{
    const [{data,fetching}] = useMeQuery();
    const router=useRouter()
    // console.log(router)
    useEffect(() => {
      if(!fetching&&!data?.Me){
      router.push("/login?next=" +router.pathname)
      }
  
    }, [fetching,data,router])
}