import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react"
import axios from "axios"
import dayjs from "dayjs"
import { useEffect, useState } from "react"





export const index = () => {

    const [Boletas, setBoletas] = useState([])

    useEffect(() => {
        const getBoletas = async () => {
            try {
                const resp = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/facturas/boleta',{
                    headers:{
                        Authorization:localStorage.getItem('token')
                        ? 'Bearer ' + localStorage.getItem('token')
                        : null
                    },
                })
                setBoletas(resp.data)
            } catch (error) {
                console.log(error)
            }
        }
        getBoletas()
    },[])

    const handlerClickDownload = async (id)=>{
        try {
            const resp = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/facturas/boleta/'+id,{
                responseType: 'arraybuffer',
                headers:{
                    Authorization:localStorage.getItem('token')
                    ? 'Bearer ' + localStorage.getItem('token')
                    : null
                },
            })
            const blob = new Blob([resp.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'boleta.pdf';
            link.click();
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <main className="h-full">
        <section className="flex flex-col justify-center items-center p-5">
            <Card>
                <h1 className="font-bold text-xl">Historial de Boletas</h1>

                <Table className="mt-5">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Cliente</TableHeaderCell>
                                <TableHeaderCell>Fecha</TableHeaderCell>
                                <TableHeaderCell>Bultos</TableHeaderCell>
                                <TableHeaderCell>Action</TableHeaderCell>
                            </TableRow>

                        </TableHead>
                        <TableBody>
                                {
                                    Boletas.map((item:any,i:number) => {

                                        return(<TableRow key={i}>
                                            <TableCell>{item.nombreCliente}</TableCell>
                                            <TableCell>{dayjs(item.fecha).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>{item.bultos}</TableCell>
                                            <TableCell><Button onClick={()=>{handlerClickDownload(item._id)}}>Descargar</Button></TableCell>
                                        </TableRow>)
                                    })
                                }
                        </TableBody>
                </Table>

            </Card>
        </section>
    </main>
  )
}


export default index