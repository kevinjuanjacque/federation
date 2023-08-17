import mongoose from 'mongoose';

const bolsaSchema = new mongoose.Schema({
  bolsa: { type: String, required: true },
  tipo: { type: String, required: true },
});

const Bolsa = mongoose.models.bolsas || mongoose.model('bolsas', bolsaSchema);

export default Bolsa;
