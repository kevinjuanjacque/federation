import { CreatePrecioDto } from '../../../helpers/interfaces/create-precio.dto';
import { connectDB } from '../../../lib/mongoose';
connectDB();

import Precios from '../../../models/precios.model';

const index = async (req, res) => {
  console.log('req.method', req.method);
  switch (req.method) {
    case 'GET': {
      const data = await Precios.find();

      return res.status(200).json(data);
    }
    case 'POST': {
      const body = req.body as CreatePrecioDto;
      const data = await Precios.create(body);

      return res.status(200).json(data);
    }
    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
