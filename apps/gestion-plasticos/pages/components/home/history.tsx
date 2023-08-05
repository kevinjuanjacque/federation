import React, { useEffect, useState } from 'react';
import { Badge, Button, Divider, TextInput } from '@tremor/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import axios from 'axios';
import {
  BadgeCheckIcon,
  BanIcon,
  BellIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'hasta %s',
    past: 'hace %s',
    s: 'en un par de segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un dia',
    dd: '%d dias',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años',
  },
});

export function History() {
  const [data, setdata] = useState([]);
  const [allData, setallData] = useState([]);

  const handleUpdatedFatura = async (state: string, id: string) => {
    try {
      const resp = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/' + id,
        {
          state,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token')
              ? 'Bearer ' + localStorage.getItem('token')
              : null,
          },
        }
      );
      alert('Factura actualizada correctamente');
    } catch (error) {
      alert('No se pudo actualizar factura');
    }
  };

  useEffect(() => {
    const getHistory = async () => {
      const resp = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas',
        {
          headers: {
            Authorization: localStorage.getItem('token')
              ? 'Bearer ' + localStorage.getItem('token')
              : null,
          },
        }
      );
      setallData(resp.data);
      setdata(resp.data);
    };
    getHistory();
  }, []);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    if (value.length === 0) return setdata(allData);

    const filtered = allData.filter((item: any) =>
      item.numero ? item.numero.toString().includes(value) : false
    );
    setdata(filtered);
  };

  return (
    <div className="h-full max-w-full">
      <TextInput
        type="text"
        placeholder="Buscar factura"
        onChange={handleSearch}
      />
      <Divider />
      <div className="h-[80%] overflow-auto">
        {data.map((item: any) => {
          const date = dayjs(item.fecha).format('DD-MM-YYYY');
          const time = dayjs(item.fecha).fromNow();
          return (
            <React.Fragment key={item._id}>
              <div className="text-xs text-gray-300"> {item._id} </div>
              <div className="">
                <strong>Numero de factura:</strong> {item.numero}{' '}
              </div>
              <div className="">
                <strong>Fecha de expiracion:</strong> {date}{' '}
              </div>
              <div className="">
                <strong>Tienes para pagar:</strong> {time}{' '}
              </div>

              <div className="w-full flex flex-row mt-2 justify-end">
                <Badge
                  size="md"
                  icon={
                    item.state == 'pendiente'
                      ? BellIcon
                      : item.state == 'anulada'
                      ? ExclamationCircleIcon
                      : BadgeCheckIcon
                  }
                  color={
                    item.state == 'pendiente'
                      ? 'yellow'
                      : item.state == 'anulada'
                      ? 'rose'
                      : 'emerald'
                  }
                >
                  {item.state.toUpperCase()}
                </Badge>
              </div>
              {item.state == 'pendiente' && (
                <section className="flex flex-col gap-2 mt-2 md:flex-row">
                  <Button
                    color="rose"
                    onClick={() => {
                      handleUpdatedFatura('anulada', item._id);
                    }}
                  >
                    Anular
                  </Button>
                  <Button
                    color="emerald"
                    onClick={() => {
                      handleUpdatedFatura('pagada', item._id);
                    }}
                  >
                    Pagada
                  </Button>
                </section>
              )}
              <Divider />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default History;
