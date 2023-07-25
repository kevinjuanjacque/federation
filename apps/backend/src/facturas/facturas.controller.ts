import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { Multer, diskStorage } from 'multer';
import { join } from 'path';
import { fileNamer } from './helpers/fileNamer.helper';
import { CreateBolsaDto } from './dto/create-bolsa.dto';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { CreateBoletaDto } from './dto/create-boleta.dto';

@Controller('facturas')
export class FacturasController {
    constructor(private facturasService:FacturasService){}


    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: join(__dirname,'assets'),
            filename: fileNamer
        })
    }))
    async createFactura(@UploadedFile() file:Express.Multer.File, @Body() body:CreateFacturaDto){
        body.static = file.filename;

        return await this.facturasService.createFactura(body);
    }

    @UseGuards(AuthGuard)
    @Get('file/:fileName')
    async getFileFacturas(@Param('fileName') fileName:string,@Res() res){

        res.sendFile(this.facturasService.getAssetFileFactura(fileName));

        return this.facturasService.getAssetFileFactura(fileName);
    
    }

    @Get()
    async getFacturas(){
        return this.facturasService.getAllFacturas();
    }

    @Post('bolsas')
    async createBolsa(@Body() body:CreateBolsaDto){
        console.log(body);
        return await this.facturasService.createBolsa(body);
    }

    @Get('precios')
    async getPrecio(){
        return await this.facturasService.getAllPrecio();
    }

    @Post('precios')
    async createPrecios(@Body() body:CreatePrecioDto){
        console.log(body);
        return await this.facturasService.createPrecio(body);
    }

    @Get('bolsas')
    async getBolsas(){
        return await this.facturasService.getAllBolsas();
    }

    @Get('clients')
    async getClients(){
        const client = await this.facturasService.getClient();

        return client;
    }

    @Post('boleta')
    async createBoleta(@Body() body:CreateBoletaDto,@Res() res){
        console.log(body);
        await this.createClientFromFactura(body)
        const boleta = await this.facturasService.createBoleta(body);
        const buffer = await this.facturasService.generatePDF(body)
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
            'x-id-file':boleta._id
            })
    
        return res.end(buffer);
    }


    @Get('boleta')
    async getBoletas(){
        const boletas = await this.facturasService.getAllBoletas();

        return boletas;
    }

    @Get('boleta/:id')
    async getBoleta(@Param('id') id:string, @Res() res){
        const boleta = await this.facturasService.getOneBoleta(id);
        const boletaDto:CreateBoletaDto = {
            nombreCliente:boleta.nombreCliente,
            rutCliente:boleta.rutCliente,
            dirCliente:boleta.dirCliente,
            fecha:boleta.fecha,
            bultos:boleta.bultos,
            iva:boleta.iva,
            detalle:boleta.detalle,
            precio:boleta.precio
        } 
        const buffer = await this.facturasService.generatePDF(boletaDto)
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
            'x-id-file':boleta._id
            })
    
        return res.end(buffer);
    }


    private async createClientFromFactura(factura:CreateBoletaDto){
        const client = await this.facturasService.getOneClient({name:factura.nombreCliente});
        if(!client){
            const newClient = await this.facturasService.createClient({name:factura.nombreCliente, rut:'',dir:''});
        }
        return;
    }

    @Get('pdf')
    async getPdf(@Res() res){
        const buffer = await this.facturasService.generatePDF({
            nombreCliente:'Juan',
            rutCliente:'12345678-9',
            dirCliente:'Calle falsa 123',
            fecha:new Date(),
            bultos:'1',
            iva:false,
            detalle:[
                {
                    bolsa:'9x25',
                    cantidad:'1',
                    precio:'1000',
                    tipo:'Normal'
                },
                {
                    bolsa:'9x35',
                    cantidad:'1',
                    precio:'2000',
                    tipo:'Especial'
                }
            ],
            precio:{
                precioNormal:'1000',
                precioEspecial:'2000'
            }
        });

        res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=example.pdf',
        'Content-Length': buffer.length,
        })

        res.end(buffer);
    }

}
