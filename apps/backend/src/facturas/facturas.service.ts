import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Model } from 'mongoose';
import { Factura } from './entities/facturas.entity';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FacturasService {


    constructor(
        @InjectModel(Factura.name)
        private readonly facturaModel: Model<Factura>
        ){}

    async createFactura(factura:CreateFacturaDto){
        factura.fecha = dayjs(factura.fecha,'MM-DD-YYYY').toDate();
        const newFactura = await this.facturaModel.create(factura);
        return newFactura;
    }

    getAssetFileFactura(fileName:string){
        const path = join(__dirname,'assets',fileName);
        
        if(!existsSync(path)){
            throw new BadRequestException('No existe el archivo');
        }

        return path;
    }

    getAllFacturas(){
        return this.facturaModel.find();
    }


}
