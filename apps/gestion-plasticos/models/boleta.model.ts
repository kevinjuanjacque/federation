import mongoose from 'mongoose';

const boletaSchema = new mongoose.Schema({
  nombreCliente: { type: String, required: true },
  rutCliente: String,
  dirCliente: String,
  bultos: { type: String, required: true },
  fecha: { type: Date, required: true },
  detalle: [
    {
      bolsa: String,
      cantidad: String,
      precio: String,
      tipo: { type: String, enum: ['Normal', 'Especial'] },
    },
  ],
  precio: {
    precioNormal: String,
    precioEspecial: String,
  },
  iva: { type: Boolean, default: false },
});

const Boleta =
  mongoose.models.boletas || mongoose.model('boletas', boletaSchema);

export default Boleta;
