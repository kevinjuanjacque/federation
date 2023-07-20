import React, { useEffect, useState } from "react";
import { API } from "../../lib/axios.config";
import { Divider, TextInput } from "@tremor/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: "hasta %s",
    past: "hace %s",
    s: 'en un par de segundos',
    m: "un minuto",
    mm: "%d minutos",
    h: "una hora",
    hh: "%d horas",
    d: "un dia",
    dd: "%d dias",
    M: "un mes",
    MM: "%d meses",
    y: "un año",
    yy: "%d años"
  }
})

export function History() {
  const [data, setdata] = useState([])
  const [allData, setallData] = useState([])

   
    useEffect(() => {
      
      const getHistory = async () => {
        const resp = await API().get('/facturas');
        setallData(resp.data)
        setdata(resp.data)
      }
      getHistory()
    }, [])

    const handleSearch = (e:any) => {
      const value = e.target.value
      if(value.length === 0) return setdata(allData)

      const filtered = allData.filter((item:any) => (item.numero)? item.numero.toString().includes(value) : false)
      setdata(filtered)
    }
    
    return (
      <div className="h-full ">
        <TextInput className="" type="text" placeholder="Buscar factura" onChange={handleSearch}/>
        <Divider />
        <div className="h-[80%] overflow-auto">
        {
          data.map((item:any) => {
            const date = dayjs(item.fecha).format("DD-MM-YYYY")
            const time = dayjs(item.fecha).fromNow()
            return (
            <React.Fragment key={item._id}>
              <div className="text-xs text-gray-300" > {item._id} </div>
              <div className="" ><strong>Numero de factura:</strong> {item.numero} </div>
              <div className="" ><strong>Fecha de expiracion:</strong> {date} </div>
              <div className="" ><strong>Tienes para pagar:</strong> {time} </div>
            <Divider />
            </React.Fragment>
          )})
        }
        </div>
      </div>
    );
  }
  
  export default History;