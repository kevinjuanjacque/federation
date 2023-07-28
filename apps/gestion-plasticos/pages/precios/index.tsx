import {
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  Title,
} from '@tremor/react';
import { useForm } from '../../hooks/useForm';
import { ClipboardCheckIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const index = () => {
  const [Disable, setDisable] = useState(true);
  const [Loading, setLoading] = useState(false);

  const { formulario, setFormulario, handleChange } = useForm({
    name: '',
    precioNormal: '',
    precioEspecial: '',
  });

  const [PreciosExist, setPreciosExist] = useState([]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/precios',
        {
          ...formulario,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
              ? 'Bearer ' + localStorage.getItem('token')
              : null,
          },
        }
      );

      setLoading(false);
      alert('Precio agregada correctamente');
      setFormulario({ name: '', precioEspecial: '', precioNormal: '' });
    } catch (error) {
      setLoading(false);
      alert('Error al agregar precios');
    }
  };

  useEffect(() => {
    if (
      formulario.name.length > 0 &&
      formulario.precioNormal.length > 0 &&
      formulario.precioEspecial.length > 0
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [formulario]);

  useEffect(() => {
    const getPrecios = async () => {
      try {
        const resp = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/precios',
          {
            headers: {
              Authorization: localStorage.getItem('token')
                ? 'Bearer ' + localStorage.getItem('token')
                : null,
            },
          }
        );
        setPreciosExist(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPrecios();
  }, []);

  return (
    <main className="h-full flex flex-col justify-center items-center p-3">
      <h1 className="text-3xl font-bold mb-3">Crear precios</h1>
      <Card className=" flex flex-col justify-center">
        <section className="flex flex-col md:flex-row gap-3 justify-center items-center p-3">
          <TextInput
            value={formulario.name}
            name="name"
            placeholder="Ingresar nombre del precio"
            onChange={handleChange}
          ></TextInput>
          <TextInput
            value={formulario.precioNormal}
            name="precioNormal"
            placeholder="Ingresar precio de bolsas normales"
            onChange={handleChange}
          ></TextInput>
          <TextInput
            value={formulario.precioEspecial}
            name="precioEspecial"
            placeholder="Ingresar precio de bolsas especiales"
            onChange={handleChange}
          ></TextInput>
        </section>
        <Divider></Divider>
        <Button
          disabled={Disable}
          onClick={handleClick}
          icon={ClipboardCheckIcon}
        >
          Crear precio
        </Button>
      </Card>
      <Divider></Divider>
      <Card className="flex flex-col justify-center items-center">
        <Title>Precios existentes</Title>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Precio</TableHeaderCell>
              <TableHeaderCell>Normal</TableHeaderCell>
              <TableHeaderCell>Especial</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PreciosExist.map((item: any, i: number) => {
              return (
                <TableRow key={i}>
                  <TableHeaderCell>{item.name}</TableHeaderCell>
                  <TableHeaderCell>{item.precioNormal}</TableHeaderCell>
                  <TableHeaderCell>{item.precioEspecial}</TableHeaderCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
};

export default index;
