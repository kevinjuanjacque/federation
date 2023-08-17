import { Button, DatePicker, TextInput } from '@tremor/react';
import axios from 'axios';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export function Ingress() {
  const [disabled, setDisabled] = useState(true);
  const [Loadin, setLoadin] = useState(false);

  const [fecha, setFecha] = useState(dayjs(new Date()).format('MM-DD-YYYY'));
  const [numero, setNumero] = useState(undefined);
  const [file, setfile] = useState(null);

  const handleDateChange = (e: any) => {
    setFecha(dayjs(e).format('MM-DD-YYYY'));
  };

  const handleNumberChange = (e: any) => {
    setNumero(e.target.value);
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setfile(img);
    }
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', file!);
    data.append('numero', numero!);
    data.append('fecha', fecha);

    try {
      setLoadin(true);
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL_V2 + '/facturas',
        data,
        {
          headers: {
            Authorization: localStorage.getItem('token')
              ? 'Bearer ' + localStorage.getItem('token')
              : null,
          },
        }
      );
      setLoadin(false);
      alert('Factura ingresada correctamente');
      setFecha('');
      setNumero(undefined);
      setfile(null);
      e.target.reset();
    } catch (error) {
      setLoadin(false);
      alert('Ocurrio un error al ingresar la factura');

      console.log(error);
    }
  };

  useEffect(() => {
    if (fecha && numero && file) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [fecha, numero, file]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-5">Ingresar Factura</h1>
      <section>
        <form className="flex flex-col gap-5" onSubmit={handleOnSubmit}>
          <TextInput
            value={numero}
            placeholder="Ingresar numero de factura"
            typeof="number"
            onChange={handleNumberChange}
          />

          <DatePicker
            defaultValue={new Date()}
            locale={es}
            placeholder="Ingresa fecha de emision"
            onValueChange={handleDateChange}
          />

          <input
            id="fileinput"
            type="file"
            placeholder="Ingresar factura"
            className="w-full"
            onChange={handleFileChange}
          />

          <Button loading={Loadin} disabled={disabled} type="submit">
            {' '}
            Enviar{' '}
          </Button>
        </form>
      </section>
    </div>
  );
}

export default Ingress;
