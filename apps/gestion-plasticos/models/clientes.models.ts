import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  rut: String,
  name: { type: String, required: true },
  dir: String,
});

const Client =
  mongoose.models.clients || mongoose.model('clients', clientSchema);

export default Client;
