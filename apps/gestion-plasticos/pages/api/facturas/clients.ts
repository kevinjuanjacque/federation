import { connectDB } from '../../../lib/mongoose';
connectDB();

import Client from '../../../models/clientes.models';

const index = async (req, res) => {
  console.log('req.method', req.method);
  switch (req.method) {
    case 'GET': {
      const data = await Client.find();

      return res.status(200).json(data);
    }
    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
