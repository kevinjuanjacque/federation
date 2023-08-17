import dayjs from 'dayjs';
import Boleta from '../../models/boleta.model';
import { formatMoney } from '../formatAmount';
import { CreateBoletaDto } from '../interfaces/create-boleta.dto';
import PDFDocument from 'pdfkit-table';

export class BoletaServices {
  async createBoleta(params: CreateBoletaDto) {
    const boleta = await Boleta.create(params);
    return boleta;
  }

  async generatePDF(params: CreateBoletaDto) {
    const PDFGenerator: Buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
      });

      // doc.image(this.getAssetFileFactura('logo.png'), 0, 0, {width: 600})
      const gapLineText = 3;
      const fontSizeDataTable = 10;
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('FABRICA DE PLASTICOS LUIS JACQUE DIAZ EIRL', {
          align: 'center',
        });
      doc.moveDown();
      doc.fontSize(12).font('Helvetica');

      doc.text(`Nombre: ${params.nombreCliente}`, {
        lineGap: gapLineText,
      });
      doc.text(`Rut: ${params.rutCliente}`, {
        lineGap: gapLineText,
      });
      doc.text(`Fecha: ${dayjs(params.fecha).format('DD-MM-YYYY')}`, {
        lineGap: gapLineText,
      });

      doc.text(`Dirección: ${params.dirCliente}`, {
        lineGap: gapLineText,
      });

      doc.text(`Bultos: ${params.bultos}`, {
        lineGap: gapLineText,
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
                fontSize: fontSizeDataTable,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            bolsa: {
              label: item.bolsa,
              options: {
                fontSize: fontSizeDataTable,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            cantidad: {
              label: item.cantidad,
              options: {
                fontSize: fontSizeDataTable,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            costo: {
              label:
                item.tipo == 'Normal'
                  ? formatMoney(params.precio.precioNormal)
                  : formatMoney(params.precio.precioEspecial),
              options: {
                fontSize: fontSizeDataTable,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
            precio: {
              label: formatMoney(item.precio),
              options: {
                fontSize: fontSizeDataTable,
                fontFamily: 'Helvetica',
                separation: true,
              },
            },
          })),
          rows: params.iva
            ? [
                [
                  '',
                  '',
                  '',
                  'Monto Bruto',
                  formatMoney(
                    params.detalle
                      .reduce((acc, curr) => acc + Number(curr.precio), 0)
                      .toString()
                  ),
                ],
                [
                  '',
                  '',
                  '',
                  'IVA',
                  formatMoney(
                    Math.round(
                      params.detalle.reduce(
                        (acc, curr) => acc + Number(curr.precio),
                        0
                      ) * 0.19
                    ).toString()
                  ),
                ],
                [
                  '',
                  '',
                  '',
                  'Monto Total',
                  formatMoney(
                    Math.round(
                      params.detalle.reduce(
                        (acc, curr) => acc + Number(curr.precio),
                        0
                      ) * 1.19
                    ).toString()
                  ),
                ],
              ]
            : [
                [
                  '',
                  '',
                  '',
                  'Monto Total',
                  formatMoney(
                    params.detalle
                      .reduce((acc, curr) => acc + Number(curr.precio), 0)
                      .toString()
                  ),
                ],
              ],
        },
        {
          columnSpacing: 5,
          padding: [5, 5, 5, 5],
          prepareHeader: () =>
            doc.font('Helvetica-Bold').fontSize(fontSizeDataTable),
          prepareRow: () =>
            doc.font('Helvetica-Bold').fontSize(fontSizeDataTable),
          title: {
            label: 'Detalle de la boleta',
            fontSize: 15,
            fontFamily: 'Helvetica-Bold',
          },
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
