import { CreateBolsaDto } from '../../../helpers/interfaces/create-bolsa.dto';
import { connectDB } from '../../../lib/mongoose';
connectDB();

import Bolsas from '../../../models/bolsas.models';

const index = async (req, res) => {
  console.log('req.method', req.method);
  switch (req.method) {
    case 'GET': {
      const data = await Bolsas.find();

      return res.status(200).json(data);
    }
    case 'POST': {
      const body = req.body as CreateBolsaDto;
      const exist = await Bolsas.findOne({
        bolsa: body.bolsa,
      });
      if (exist.bolsa) {
        return res.status(400).json({ message: 'Bolsa ya existe' });
      }
      const data = await Bolsas.create(body);

      return res.status(200).json(data);
    }
    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
