import dayjs from 'dayjs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { CreateFacturaDto } from '../interfaces/create-factura.dto';
import Factura from '../../models/facturas.model';
import nodemailer from 'nodemailer';
import { existsSync } from 'fs';

class FacturaService {
  async createFactura(factura: CreateFacturaDto) {
    factura.fecha = dayjs(factura.fecha, 'MM-DD-YYYY').toDate();
    const newFactura = await Factura.create(factura);
    await this.createEventIcs(newFactura);
    this.sendEmail(
      'facturas.fabrica@outlook.com',
      `Nueva factura ingresada ${factura.numero}`,
      `Se ha creado una nueva factura con el id: ${newFactura.numero}`,
      factura.static
    );
    return newFactura;
  }

  async updatedFactura(state: 'pendiente' | 'pagada' | 'anulada', id: string) {
    const factura = await Factura.findByIdAndUpdate(id, { state });

    return factura;
  }

  private async createEventIcs(factura: CreateFacturaDto) {
    const dateStrat =
      dayjs(factura.fecha, { format: 'MM-DD-YYYY HH:mm:ss', locale: 'UTC-4' })
        .set('hours', 5)
        .add(90, 'day')
        .format('YYYYMMDDTHHmmss') + 'Z';

    const dateEND =
      dayjs(factura.fecha, { format: 'MM-DD-YYYY HH:mm:ss', locale: 'UTC-4' })
        .set('hours', 23)
        .add(90, 'day')
        .format('YYYYMMDDTHHmmss') + 'Z';

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

    return writeFile(join(__dirname, 'assets', `event.ics`), event);
  }

  private async sendEmail(
    to: string,
    subject: string,
    body: string,
    fileName: string
  ) {
    const mailOptions = {
      from: 'kevin.jacque@alumnos.ucentral.cl',
      to,
      subject,
      text: body,
    };

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_EMAIL,
        },
      });

      transporter.sendMail({
        to, // list of receivers
        from: mailOptions.from, // sender address
        subject,
        text: body,
        attachments: [
          {
            filename: 'evento.ics',
            path: join(__dirname, 'assets', `event.ics`),
            cid: 'evento',
          },
          {
            filename: fileName,
            path: this.getAssetFileFactura(fileName),
            cid: 'factura',
          },
        ],
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }

  getAssetFileFactura(fileName: string) {
    const path = join(__dirname, 'assets', fileName);

    if (!existsSync(path)) {
      throw new Error('No existe el archivo');
    }

    return path;
  }
}

export const facturaService = new FacturaService();
