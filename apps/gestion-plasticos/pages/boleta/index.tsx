import {
  Button,
  Card,
  DatePicker,
  Divider,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from '@tremor/react';
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { useForm } from '../../hooks/useForm';
import axios from 'axios';
import {
  ArrowDownIcon,
  ArrowNarrowDownIcon,
  DocumentAddIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { InputBolsa } from '../components/boleta/InputBolsa';
import { es } from 'date-fns/locale';
import { formatMoney } from 'apps/gestion-plasticos/helpers/formatAmount';

export const Index = () => {
  const { formulario, setFormulario, handleChange } = useForm({
    nombreCliente: '',
    rutCliente: '',
    dirCliente: '',
    bultos: '0',
    fecha: new Date(),
    iva: false,
  });
  const [ClientSelected, setClientSelected] = useState('');
  const [ClientesExist, setClientesExist] = useState([
    {
      name: 'Cliente 1',
      rut: '12345678-9',
      dir: 'Direccion 1',
    },
  ]);

  const [imageURL, setImageURL] = useState(null);

  const [Detalle, setDetalle] = useState([]);

  const [Precios, setPrecios] = useState([]);
  const [PrecioSelected, setPrecioSelected] = useState(null);

  const InputsClient = [
    { name: 'nombreCliente', label: 'Ingresar nombre del cliente' },
    { name: 'rutCliente', label: 'Rut del cliente' },
    { name: 'dirCliente', label: 'Direccion del cliente' },
  ];

  useEffect(() => {
    try {
      const getPrecios = async () => {
        const resp = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/precios',
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        const precios = resp.data;
        setPrecios(precios);
      };

      getPrecios();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setFormulario({ ...formulario, bultos: Detalle.length.toString() });
  }, [Detalle]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const resp = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/clients',
          {
            headers: {
              Authorization: localStorage.getItem('token')
                ? 'Bearer ' + localStorage.getItem('token')
                : null,
            },
          }
        );
        setClientesExist(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHistory();
  }, []);

  const handleClickCreateBoleta = async () => {
    try {
      const resp = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/boleta',
        {
          ...formulario,
          detalle: Detalle,
          precio: {
            precioNormal: PrecioSelected.precioNormal,
            precioEspecial: PrecioSelected.precioEspecial,
          },
        },
        {
          responseType: 'arraybuffer',
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      const id = resp.headers['X-Id-File'];

      const blob = new Blob([resp.data], { type: 'application/pdf' });
      const imageUrlObject = URL.createObjectURL(blob);
      setImageURL({ id, url: imageUrlObject });
      setClientSelected('');
      setPrecioSelected(null);
      setFormulario({
        nombreCliente: '',
        rutCliente: '',
        dirCliente: '',
        bultos: '0',
        fecha: new Date(),
        iva: false,
      });
      setDetalle([]);
      alert('Boleta creada con exito');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="h-full flex flex-col justify-center items-center p-5">
        <h1 className="text-2xl font-bold mb-3"> Crear Boleta</h1>
        <Card>
          <h1 className="text-md p-3 font-bold">Información del Cliente</h1>

          <SearchSelect
            value={ClientSelected ? JSON.stringify(ClientSelected) : ''}
            className="mb-3"
            placeholder="Elegir cliente existente (opcional)"
            onValueChange={(e) => {
              const value = JSON.parse(e);
              setClientSelected(value);
              setFormulario({
                ...formulario,
                nombreCliente: value.name,
                rutCliente: value.rut,
                dirCliente: value.dir,
              });
            }}
          >
            {ClientesExist.map((item: any, i) => (
              <SearchSelectItem key={'' + i} value={JSON.stringify(item)}>
                {item.name}
              </SearchSelectItem>
            ))}
          </SearchSelect>
          <section className="flex flex-col md:flex-row gap-3">
            {InputsClient.map((item, i) => {
              return (
                <TextInput
                  key={item.name}
                  value={formulario[item.name]}
                  type="text"
                  name={item.name}
                  onChange={handleChange}
                  placeholder={item.label}
                ></TextInput>
              );
            })}
          </section>
          <Divider />
          <section className="flex flex-col md:flex-row gap-3 items-center justify-center">
            <div className="w-full">
              <label className="text-sm p-3 ">Bultos</label>
              <TextInput
                disabled={true}
                value={formulario.bultos}
                type="text"
                name="bultos"
                onChange={handleChange}
                placeholder="Cantidad de bultos"
              ></TextInput>
            </div>
            <div className="w-full">
              <label className="text-sm p-3 ">Fecha</label>

              <DatePicker
                value={formulario.fecha}
                locale={es}
                onValueChange={(value) => {
                  setFormulario({ ...formulario, fecha: value });
                }}
              ></DatePicker>
            </div>
            <div className="w-full">
              <label className="text-sm p-3 ">Seleccionar precio</label>

              <SearchSelect
                value={PrecioSelected ? JSON.stringify(PrecioSelected) : ''}
                placeholder="Seleccionar precio"
                onValueChange={(value) => {
                  const precioselected = JSON.parse(value);
                  setPrecioSelected(precioselected);
                }}
              >
                {Precios.map((item: any, i: number) => (
                  <SearchSelectItem key={'' + i} value={JSON.stringify(item)}>
                    {item.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </div>
          </section>
        </Card>
        <Card className="mt-2">
          <h1 className="text-md p-3 font-bold">Detalle boleta</h1>
          <section className="">
            {Detalle.map((item, i) => {
              return (
                <React.Fragment key={i + item.bolsa}>
                  <InputBolsa
                    handleChange={(e) => {
                      const { name, value } = e.targe;
                      //{bolsa:"",cantidad:"",precio:"0"}
                      //1.
                    }}
                    setDetalle={setDetalle}
                    itemDetail={item}
                    position={i}
                    precios={PrecioSelected}
                  />
                  <Divider />
                </React.Fragment>
              );
            })}
          </section>
          <section className="flex justify-end">
            <div className=" flex gap-3">
              {formulario.iva && (
                <>
                  <div>
                    <h1 className="text-md p-3 font-bold">IVA</h1>
                    <TextInput
                      disabled
                      value={formatMoney(
                        Math.round(
                          Detalle.reduce(
                            (acc, i) => acc + parseInt(i.precio),
                            0
                          ) * 0.19
                        ).toString()
                      )}
                    />
                  </div>
                  <div>
                    <h1 className="text-md p-3 font-bold">NETO</h1>
                    <TextInput
                      disabled
                      value={formatMoney(
                        Detalle.reduce((acc, i) => acc + parseInt(i.precio), 0)
                      )}
                    />
                  </div>
                </>
              )}
              <div>
                <h1 className="text-md p-3 font-bold">TOTAL</h1>
                <TextInput
                  disabled
                  value={formatMoney(
                    Math.round(
                      Detalle.reduce((acc, i) => acc + parseInt(i.precio), 0) *
                        (formulario.iva ? 1.19 : 1)
                    ).toString()
                  )}
                />
              </div>
            </div>
          </section>
          <Divider />
          <div className="flex justify-center">
            <input
              type="checkbox"
              onChange={(e) => {
                setFormulario({ ...formulario, iva: e.target.checked });
              }}
              checked={formulario.iva}
            ></input>
            <label className="text-sm p-3 ">CON IVA</label>
          </div>
          <section className="flex flex-col md:flex-row items-stretch md:items-center justify-center mt-3 gap-2">
            <Button
              disabled={PrecioSelected === null}
              onClick={() => {
                setDetalle([
                  ...Detalle,
                  { bolsa: '', cantidad: '', precio: '0' },
                ]);
              }}
              icon={PlusIcon}
            >
              {' '}
              Agregar Bolsa{' '}
            </Button>
            <Button
              color="green"
              disabled={Detalle.length == 0 || formulario.nombreCliente == ''}
              icon={DocumentAddIcon}
              onClick={handleClickCreateBoleta}
            >
              Crear Boleta
            </Button>
            {imageURL && (
              <>
                <a
                  href={imageURL.url}
                  download={new Date().getTime() + `-factura.pdf`}
                >
                  <Button color="gray" icon={ArrowNarrowDownIcon}>
                    Descargar Imagen
                  </Button>
                </a>
              </>
            )}
          </section>
        </Card>
      </main>
    </>
  );
};

export default Index;
