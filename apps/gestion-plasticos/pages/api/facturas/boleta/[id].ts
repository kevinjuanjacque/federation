import { BoletaServices } from '../../../../helpers/services/boleta.service';
import { connectDB } from '../../../../lib/mongoose';
connectDB();

import Boletas from '../../../../models/boleta.model';

const boletaServices = new BoletaServices();
const getBoleta = async (id, res) => {
  const dataBoleta = await Boletas.findById(id);

  const boleta = await boletaServices.createBoleta(dataBoleta);
  const buffer = await boletaServices.generatePDF(dataBoleta);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
  res.setHeader('Content-Length', buffer.length);
  res.setHeader('x-id-file', boleta._id);

  return res.end(buffer);
};

const index = async (req, res) => {
  const { id } = req.query;
  switch (req.method) {
    case 'DELETE': {
      const data = await Boletas.findByIdAndDelete(id);

      return res.status(200).json(data);
    }

    case 'GET': {
      return getBoleta(id, res);
    }

    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
