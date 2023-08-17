import { BoletaServices } from '../../../helpers/services/boleta.service';
import { CreateBoletaDto } from '../../../helpers/interfaces/create-boleta.dto';
import { connectDB } from '../../../lib/mongoose';
connectDB();

import Boleta from '../../../models/boleta.model';
import Clients from '../../../models/clientes.models';

const boletaService = new BoletaServices();

const postBoleta = async (body: CreateBoletaDto, res) => {
  const client = await Clients.findOne({
    name: body.nombreCliente,
  });
  if (!client) {
    await Clients.create({
      name: body.nombreCliente,
      rut: body.rutCliente,
      dir: body.dirCliente,
    });
  }

  const boleta = await boletaService.createBoleta(body);
  const buffer = await boletaService.generatePDF(body);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
  res.setHeader('Content-Length', buffer.length);
  res.setHeader('x-id-file', boleta._id);

  return res.end(buffer);
};

//darle un tipo string al body del req
//req.body: string
const index = async (req, res) => {
  console.log('req.method', req.method);
  switch (req.method) {
    case 'GET': {
      const data = await Boleta.find();

      return res.status(200).json(data);
    }
    case 'POST': {
      const body = req.body as CreateBoletaDto;

      console.log('body');
      return postBoleta(body, res);
    }
    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
