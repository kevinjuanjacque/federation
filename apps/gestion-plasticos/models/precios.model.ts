import mongoose from 'mongoose';

const precioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  precioNormal: { type: String, required: true },
  precioEspecial: { type: String, required: true },
});

const Precio =
  mongoose.models.precios || mongoose.model('precios', precioSchema);

export default Precio;
