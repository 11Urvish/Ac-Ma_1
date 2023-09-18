import { model, Schema } from 'mongoose';

const CountrySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true, default: 91 },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  currency: { type: String, required: true, trim: true },
  currency_icon: { type: String, required: true, trim: true },
  status: { type: Number, required: true, trim: true, default: 1 },
});

export default model('Country', CountrySchema);