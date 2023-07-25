

import { Button, Card, Divider, SearchSelect, SearchSelectItem, Table, TableBody, TableHead, TableHeaderCell, TableRow, TextInput } from '@tremor/react'
import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { ClipboardCheckIcon } from '@heroicons/react/outline'
import axios from 'axios'

export const index = () => {
    const {formulario,handleChange,setFormulario}=useForm({bolsa:"", tipo:""})
    const [Disable, setDisable] = useState(true)
    const [Loading, setLoading] = useState(false)

    const [BolsasExist, setBolsasExist] = useState([])

    useEffect(() => {
        if(formulario.bolsa.length > 0 && formulario.tipo.length > 0){
            setDisable(false)
        }else{
            setDisable(true)
        }
    }, [formulario])

    const handleClick = async () => {
        setLoading(true)
        try {
            const resp = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+'/facturas/bolsas',{
                ...formulario
            },{
                headers:{
                    'Content-Type':'application/json',
                    Authorization:localStorage.getItem('token')
                    ? 'Bearer ' + localStorage.getItem('token')
                    : null
                },
            })

            setLoading(false)
            alert('Bolsa agregada correctamente')
            setFormulario({bolsa:"", tipo:""})
        } catch (error) {
            setLoading(false)
            alert('Error al agregar bolsa')
        }
    }

    useEffect(() => {
        const getBolsas =async ()=> {
            try {
                const resp = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/facturas/bolsas',{
                    headers:{
                        Authorization:localStorage.getItem('token')
                        ? 'Bearer ' + localStorage.getItem('token')
                        : null
                    },
                })
                setBolsasExist(resp.data)
            } catch (error) {
                console.log(error)
            }
        
        }
        getBolsas()
        
    }, [])
    
  return (
    <main className='h-full flex flex-col justify-center items-center p-3'>

        <Card>
                <h1 className='text-2xl font-bold'>Agregar bolsas</h1>
            <section className='flex flex-col sm:flex-row gap-3 justify-center items-center p-3'>

                <div className="" >
                    <TextInput value={formulario.bolsa} name='bolsa' placeholder='Ingresar bolsa' onChange={handleChange} ></TextInput>
                </div>
                <div className="" >
                    <SearchSelect value={formulario.tipo} placeholder='Ingresar tipo de bolsa' onValueChange={(value)=>{
                        setFormulario({...formulario,tipo:value})
                    }} >
                        <SearchSelectItem value="Especial" >Especial</SearchSelectItem>
                        <SearchSelectItem value="Normal" >Normal</SearchSelectItem>
                    </SearchSelect>
                </div>
            </section>
                <div className='flex flex-col items-center justify-center mt-3'>
            <Button onClick={handleClick} disabled={Disable} loading={Loading} loadingText='Cargando...' icon={ClipboardCheckIcon} className=''>Confirmar</Button>

                </div>
        </Card>
        <Divider></Divider>
        <Card className='flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-bold'>Bolsas existentes</h1>
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell> Bolsa </TableHeaderCell>
                        <TableHeaderCell> Tipo </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        BolsasExist.map((item:any)=>(<TableRow key={item._id}>
                            <TableHeaderCell>{item.bolsa}</TableHeaderCell>
                            <TableHeaderCell>{item.tipo}</TableHeaderCell>
                        </TableRow>))
                    }
                </TableBody>
            </Table>
            </Card>
    </main>
  )
}

export default index
