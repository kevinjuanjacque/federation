import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { Multer, diskStorage } from 'multer';
import { join } from 'path';
import { fileNamer } from './helpers/fileNamer.helper';

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
    @Get(':fileName')
    async getFileFacturas(@Param('fileName') fileName:string,@Res() res){

        res.sendFile(this.facturasService.getAssetFileFactura(fileName));

        return this.facturasService.getAssetFileFactura(fileName);
    
    }

    @Get()
    async getFacturas(){
        return this.facturasService.getAllFacturas();
    }

}
