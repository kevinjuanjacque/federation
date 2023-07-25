import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import NavBar from './components/navbar';
import AuthComponents from './components/AuthComponents';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@tremor/react';
import { MenuIcon } from '@heroicons/react/outline';

function CustomApp({ Component, pageProps }: AppProps) {

  //TODO: change false
  const [Drawer, setDrawer] = useState(false)
  const router = useRouter()

  const menu = [
    {
      name: 'Home',
      icon: '',
      url: '/home',
    },
    {
      name: 'Historial de Boletas',
      icon: '',
      url: '/boleta/historial',
    },{
      name: 'Crear Boletas',
      icon: '',
      url: '/boleta',
    },
    {
      name: 'Crear Precios',
      icon: '',
      url: '/precios',
    },
    {
      name: 'Crear Bolsas',
      icon: '',
      url: '/bolsas',
    }
  ]

  return (
    <AuthComponents>
      <Head>
        <title>Welcome to gestion-plasticos!</title>
      </Head>
      <main className="flex flex-col min-h-screen">
        {Drawer && <div className='bg-black absolute z-10 bg-opacity-50 h-screen w-full'>
          <div className='bg-white w-full md:w-[50%] absolute z-20 h-screen opacity-100 '>
            <section>
              <h1 className='text-2xl font-bold p-5'>Menu</h1>
              {
                menu.map((item,i) => {
                  return (
                    <div key={i} className='p-5 hover:bg-gray-200 cursor-pointer' onClick={() => {
                      setDrawer(false)
                      router.push(item.url)
                    }}>
                      {item.name}
                    </div>
                  )
                })
              }
            </section>
          </div>
        </div>}
        <NavBar />
        <Component className="" {...pageProps} />
        <Button icon={MenuIcon} className='fixed bottom-5 right-5 rounded-full'
        onClick={()=>{
          setDrawer(true)
        }}>
          Menú
        </Button>
      </main>
    </AuthComponents>
  );
}

export default CustomApp;
