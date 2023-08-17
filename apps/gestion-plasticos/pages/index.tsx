import { Button, Callout, Card, Metric, TextInput } from '@tremor/react';
import { UserIcon, KeyIcon, ExclamationIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import useUser from './components/AuthComponents';
import { useRouter } from 'next/router';
import axios from 'axios';

export function Index() {
  const [disabled, setDisabled] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Errors, setErrors] = useState(false);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (Email.length > 4 && Password.length > 4) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
    return () => {
      mounted = false;
    };
  }, [Password, Email]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const resp = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/auth',
        {
          email: Email,
          password: Password,
        }
      );
      setErrors(false);
      const { token } = resp.data;
      localStorage.setItem('token', token);
      setLoading(false);
      router.push('/home');
    } catch (error) {
      setErrors(true);
      setLoading(false);
    }
  };

  return (
    <div className="bg-cuarto flex-1 h-full flex flex-col justify-center items-center ">
      <main className="  max-w-screen-xl">
        <Card className="p-5 flex flex-col  gap-2" title="Iniciar sesion">
          <Metric>Iniciar sesion</Metric>
          <TextInput
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            icon={UserIcon}
            placeholder="email"
          />
          <TextInput
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            icon={KeyIcon}
            placeholder="password"
          />
          <Button
            loading={Loading}
            loadingText="Cargando..."
            onClick={handleLogin}
            disabled={disabled}
          >
            {' '}
            Entrar{' '}
          </Button>
          {Errors && (
            <Callout
              className="h-12 mt-4"
              title="Fallaste en la autenticacion"
              icon={ExclamationIcon}
              color="rose"
            >
              Revisa si tu email y contraseña son correctos
            </Callout>
          )}
        </Card>
      </main>
    </div>
  );
}

export default Index;
