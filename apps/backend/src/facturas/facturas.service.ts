import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FilterQuery, Model } from 'mongoose';
import { Factura } from './entities/facturas.entity';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import { join } from 'path';
import { existsSync } from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { writeFile } from 'fs/promises';
import { Client } from './entities/clientes.entity';
import { Bolsa } from './entities/bolsas.entity';
import { CreateBolsaDto } from './dto/create-bolsa.dto';
import { Precio } from './entities/precios.entity';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { Boleta } from './entities/boleta.entity';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { ClientDto } from './dto/create-cliente.dto';
import PDFDocument from 'pdfkit-table';
import { formatMoney } from './helpers/formatAmount';

@Injectable()
export class FacturasService {
  constructor(
    @InjectModel(Factura.name)
    private readonly facturaModel: Model<Factura>,
    @InjectModel(Client.name)
    private readonly clienModel: Model<Client>,
    @InjectModel(Bolsa.name)
    private readonly bolsaModel: Model<Bolsa>,
    @InjectModel(Precio.name)
    private readonly precioModel: Model<Precio>,
    @InjectModel(Boleta.name)
    private readonly boletaModel: Model<Boleta>,
    private readonly mailerService: MailerService
  ) {}

  async createFactura(factura: CreateFacturaDto) {
    factura.fecha = dayjs(factura.fecha, 'MM-DD-YYYY').toDate();
    const newFactura = await this.facturaModel.create(factura);
    await this.createEventIcs(newFactura);
    this.sendEmail(
      'facturas.fabrica@outlook.com',
      `Nueva factura ingresada ${factura.numero}`,
      `Se ha creado una nueva factura con el id: ${newFactura.numero}`,
      factura.static
    );
    return newFactura;
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

  getAssetFileFactura(fileName: string) {
    const path = join(__dirname, 'assets', fileName);

    if (!existsSync(path)) {
      throw new BadRequestException('No existe el archivo');
    }

    return path;
  }

  getAllFacturas() {
    return this.facturaModel.find();
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
      this.mailerService.sendMail({
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

  async createBolsa(bolsa: CreateBolsaDto) {
    const newBolsa = await this.bolsaModel.create(bolsa);

    return newBolsa;
  }

  async getAllBolsas() {
    const bolsas = await this.bolsaModel.find();

    return bolsas;
  }

  async createPrecio(precio: CreatePrecioDto) {
    const newPrecio = await this.precioModel.create(precio);

    return newPrecio;
  }

  async getAllPrecio() {
    const precio = await this.precioModel.find();

    return precio;
  }

  async getClient() {
    const client = await this.clienModel.find();
    return client;
  }
  async createClient(cliente: ClientDto) {
    const client = await this.clienModel.create(cliente);
    return client;
  }

  async getOneClient(options: FilterQuery<Boleta>) {
    const boleta = await this.clienModel.findOne(options);
    return boleta;
  }

  async createBoleta(params: CreateBoletaDto) {
    const boleta = await this.boletaModel.create(params);
    return boleta;
  }

  async getAllBoletas() {
    const boleta = await this.boletaModel.find();
    return boleta;
  }

  async getOneBoleta(id:string) {
    const boleta = await this.boletaModel.findById(id);
    return boleta;
  }

  async generatePDF(params: CreateBoletaDto) {
    const PDFGenerator: Buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument();

      // doc.image(this.getAssetFileFactura('logo.png'), 0, 0, {width: 600})

      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('FABRICA DE PLASTICOS LUIS JACQUE DIAZ EIRL', {
          align: 'center',
        });
      doc.moveDown();
      doc.fontSize(15).font('Helvetica');

      doc.text(`Nombre: ${params.nombreCliente}`,{
        lineGap: 5,
      });
      doc.text(`Rut: ${params.rutCliente}`,{
        lineGap: 5,
      });
      doc.text(`Fecha: ${dayjs(params.fecha).format('DD-MM-YYYY')}`,{
        lineGap: 5,
      });
      doc.text(`Bultos: ${params.bultos}`,{
        lineGap: 5,
      });
      doc.moveDown();


      doc.table(
        {
          headers: [
            { label: 'Tipo', property: 'tipo' },
            { label: 'Bolsa', property: 'bolsa' },
            { label: 'Cantidad', property: 'cantidad' },
            { label: 'Costo', property: 'costo' },
            { label: 'TOTAL', property: 'precio' },
          ],
          datas: params.detalle.map((item) => ({
            tipo: {
              label: item.tipo,
              options: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            bolsa: {
              label: item.bolsa,
              options: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            cantidad: {
              label: item.cantidad,
              options: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },costo: {
              label: item.tipo == 'Normal' ? formatMoney(params.precio.precioNormal) : formatMoney(params.precio.precioEspecial),
              options: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            precio: {
              label: formatMoney(item.precio),
              options: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
          })),
          rows: params.iva ? [
            [
              '',
              '',
              '',
              'Monto Bruto',
              formatMoney(params.detalle
                .reduce((acc, curr) => acc + Number(curr.precio), 0)
                .toString()),
            ],
            ['','','','IVA',formatMoney(Math.round(params.detalle
            .reduce((acc, curr) => acc + Number(curr.precio), 0)*0.19)
            .toString())],
            [
              '',
              '',
              '',
              'Monto Total',
              formatMoney(Math.round(params.detalle
                .reduce((acc, curr) => acc + Number(curr.precio), 0)*1.19)
                .toString()),
            ],
          ]:[
            
            [
              '',
              '',
              '',
              'Monto Total',
              formatMoney(params.detalle
                .reduce((acc, curr) => acc + Number(curr.precio), 0)
                .toString()),
            ],
          ],
        },
        {
          columnSpacing: 10,
          padding: [5, 5, 5, 5],
          prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
          prepareRow: () => doc.font('Helvetica-Bold').fontSize(12),
          title: {label:'Detalle de la boleta', fontSize: 15, fontFamily: 'Helvetica-Bold', },
        }
      );

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });
    return PDFGenerator;
  }
}
