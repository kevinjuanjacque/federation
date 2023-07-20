
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'





export default function useUser({
    redirectTo = '',
    redirectIfFound = false,
  } = {}){
    const [IsLogin, setIsLogin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        
        

        const test = async ()=>{
            const resp = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"/auth",{
                headers:{
                    Authorization:localStorage.getItem('token')
                    ? 'Bearer ' + localStorage.getItem('token')
                    : null
                }
            }).catch((err)=>err.response)
            console.log(resp.data)
        if (!redirectTo || resp.data !== "OK"){ 
            setIsLogin(false)
            return
    }
        if (
          // If redirectTo is set, redirect if the user was not found.
          (redirectTo && !redirectIfFound && resp?.data === "OK") ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectIfFound && resp?.data === "OK")
        ) {

            setIsLogin(true)
            router.replace(redirectTo)
        }
        }

        test()
      }, [redirectIfFound, redirectTo,router])

      return [ IsLogin ]

}