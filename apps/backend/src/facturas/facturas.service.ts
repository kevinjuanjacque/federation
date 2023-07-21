import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Model } from 'mongoose';
import { Factura } from './entities/facturas.entity';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import { join } from 'path';
import { existsSync } from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { writeFile } from 'fs/promises';


@Injectable()
export class FacturasService {


    constructor(
        @InjectModel(Factura.name)
        private readonly facturaModel: Model<Factura>,
        private readonly mailerService: MailerService

        ){
         
        }

    async createFactura(factura:CreateFacturaDto){
        factura.fecha = dayjs(factura.fecha,'MM-DD-YYYY').toDate();
        const newFactura = await this.facturaModel.create(factura);
        await this.createEventIcs(newFactura);
        this.sendEmail('facturas.fabrica@outlook.com','Nueva factura',`Se ha creado una nueva factura con el id: ${newFactura.numero}`)
        return newFactura;
    }


    private async createEventIcs(factura:CreateFacturaDto){

        const dateStrat = dayjs(factura.fecha,{format:'MM-DD-YYYY HH:mm:ss', locale:'UTC-4'}).set('hours',5).format('YYYYMMDDTHHmmss')+'Z'
        
        const dateEND = dayjs(factura.fecha,{format:'MM-DD-YYYY HH:mm:ss', locale:'UTC-4'}).set('hours',23).format('YYYYMMDDTHHmmss')+'Z'



        const event = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID: ${factura.numero}
DTSTAMP:${dateStrat}
DTSTART:${dateStrat}
DTEND:${dateEND}
SUMMARY:PAGAR Factura ${factura.numero}
DESCRIPTION:Se ha creado una nueva factura con el id: ${factura.numero}
END:VEVENT
END:VCALENDAR`;


        return writeFile(join(__dirname,'assets',`event.ics`),event);

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

    private async sendEmail(to: string, subject: string, body: string) {
        const mailOptions = {
          from: 'kevin.jacque@alumnos.ucentral.cl',
          to,
          subject,
          text: body,
        };

        try {
          this.mailerService
            .sendMail({
              to, // list of receivers
              from:mailOptions.from, // sender address
              subject,
              text: body,
              attachments: [
                {
                  filename:'evento.ics',
                  path: join(__dirname,'assets',`event.ics`),
                  cid:'perroti123'
              }
              ]
            })
          
        } catch (error) {
          console.error('Error al enviar el correo:', error);
          throw error;
        }
      }


}
