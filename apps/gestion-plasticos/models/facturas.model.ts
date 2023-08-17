import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  fecha: { type: Date, required: true },
  static: { type: String, required: true },
  state: {
    type: String,
    required: true,
    default: 'pendiente',
    enum: ['pagada', 'pendiente', 'anulada'],
  },
});

const Factura =
  mongoose.models.facturas || mongoose.model('facturas', facturaSchema);

export default Factura;
