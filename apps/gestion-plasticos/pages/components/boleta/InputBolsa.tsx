import { TrashIcon } from '@heroicons/react/outline';
import {
  Button,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from '@tremor/react';
import { formatMoney } from 'apps/gestion-plasticos/helpers/formatAmount';
import axios from 'axios';
import exp from 'constants';
import React, { ChangeEventHandler, use, useEffect, useState } from 'react';

export const InputBolsa = ({
  handleChange,
  setDetalle,
  itemDetail,
  position,
  precios,
}: {
  handleChange: any;
  setDetalle: any;
  itemDetail: any;
  position: number;
  precios: any;
}) => {
  const [Bolsas, setBolsas] = useState([]);
  const [BolsaSelected, setBolsaSelected] = useState({ bolsa: '', tipo: '' });

  useEffect(() => {
    const getBolsas = async () => {
      try {
        const resp = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/facturas/bolsas',
          {
            headers: {
              Authorization: localStorage.getItem('token')
                ? 'Bearer ' + localStorage.getItem('token')
                : null,
            },
          }
        );
        setBolsas(resp.data);

        setBolsaSelected(
          resp.data.find((item: any) => item.bolsa === itemDetail.bolsa)
        );
      } catch (error) {
        console.log(error);
      }
    };
    getBolsas();
  }, []);

  // useEffect(() => {
  //   console.log(BolsaSelected);
  //   if (BolsaSelected) {
  //     const precio =
  //       BolsaSelected.tipo === 'Normal'
  //         ? precios?.precioNormal ?? '0'
  //         : precios?.precioEspecial ?? '0';

  //     setDetalle((detalle: any) => {
  //       return detalle.map((item: any, i: number) => {
  //         if (i === position) {
  //           return { ...item, precio: precio ?? 0 * item?.cantidad ?? 0 };
  //         } else {
  //           return item;
  //         }
  //       });
  //     });
  //   }
  // }, [precios, BolsaSelected]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-end justify-center ">
      <div className="w-full">
        <label className="text-sm p-3 ">Bolsa</label>
        <SearchSelect
          value={JSON.stringify(BolsaSelected)}
          onValueChange={(value) => {
            const bolsa = JSON.parse(value);
            setBolsaSelected(bolsa);
            setDetalle((detalle: any) => {
              return detalle.map((item: any, i: number) => {
                if (i === position) {
                  return { ...item, bolsa: bolsa.bolsa, tipo: bolsa.tipo };
                } else {
                  return item;
                }
              });
            });
          }}
          placeholder="Ingresar bolsa"
        >
          {Bolsas.map((item: any, i: number) => (
            <SearchSelectItem key={'' + i} value={JSON.stringify(item)}>
              {item.bolsa}
            </SearchSelectItem>
          ))}
        </SearchSelect>
      </div>
      <div className="w-full">
        <label className="text-sm p-3 ">Cantidad</label>
        <TextInput
          value={itemDetail?.cantidad ?? ''}
          type="text"
          name="cantidad"
          onChange={(e) => {
            const value = e.target.value;

            const precio =
              itemDetail.tipo === 'Normal'
                ? precios?.precioNormal ?? '0'
                : precios?.precioEspecial ?? '0';
            setDetalle((detalle: any) => {
              return detalle.map((item: any, i: number) => {
                if (i === position) {
                  const precioCal = parseInt(precio) * parseFloat(value);
                  return {
                    ...item,
                    cantidad: value,
                    precio: isNaN(precioCal) ? 0 : precioCal,
                  };
                } else {
                  return item;
                }
              });
            });
          }}
          placeholder="Cantidad de productos"
        ></TextInput>
      </div>
      <div>
        <label className="text-sm p-3 ">Precio</label>
        <TextInput
          value={formatMoney(
            isNaN(itemDetail?.precio ?? 0)
              ? '0'
              : Math.round(itemDetail?.precio ?? 0).toString()
          )}
          disabled={true}
          type="text"
          name="precio"
          onChange={handleChange}
          placeholder="Precio unitario"
        ></TextInput>
      </div>
      <div>
        <Button
          icon={TrashIcon}
          color="red"
          onClick={() => {
            setDetalle((detalle: any) => {
              return detalle.filter((item: any, i: number) => {
                return i !== position;
              });
            });
          }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default InputBolsa;
