import { Card, Divider } from '@tremor/react';
import { useRouter } from 'next/router';
import React from 'react';

export const index = () => {
  const router = useRouter();
  const menu = [
    {
      name: 'Facturas',
      icon: '',
      url: '/facturas',
      description: 'Revisar y añadir facturas de proveedores',
    },
    {
      name: 'Historial de Boletas',
      icon: '',
      url: '/boleta/historial',
      description: 'Revisar historial de boletas creadas a clientes',
    },
    {
      name: 'Crear Boletas',
      icon: '',
      url: '/boleta',
      description: 'Crear boleta para clientes',
    },
    {
      name: 'Crear Precios',
      icon: '',
      url: '/precios',
      description: 'Crear precio de bolsas Normal/Especial',
    },
    {
      name: 'Crear Bolsas',
      icon: '',
      url: '/bolsas',
      description: 'Crear bolsas de plastico',
    },
  ];
  return (
    <div className=" h-full flex-1 flex flex-col justify-center items-center">
      <div>
        <Card className=" ">
          <h1 className="font-bold text-xl">Bienvenidos</h1>
          <p className="text-justify">Que deseas realizar?</p>
          <Divider></Divider>
          {menu.map((item, i) => {
            return (
              <div
                key={i}
                className="p-5 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push(item.url);
                }}
              >
                {item.name}
                <p className="text-xs font-thin ">{item.description} </p>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default index;
