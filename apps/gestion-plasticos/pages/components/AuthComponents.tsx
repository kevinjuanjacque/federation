import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthComponents({children}) {

  const router = useRouter();

  useEffect(() => {
    const test = async () => {
      await axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth', {
          headers: {
            Authorization: localStorage.getItem('token')
              ? 'Bearer ' + localStorage.getItem('token')
              : null,
          },
        }).then(() => {
          router.pathname === '/' ? router.push('/home') : null;
        })
        .catch(() => {
            router.push('/');    
        });
      
    };
    test();
  }, []);

  return <>{children}</>;
}


