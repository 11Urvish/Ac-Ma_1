import { model, Schema } from 'mongoose';

const CitySchema: Schema = new Schema({
  country_id: { type: Number, required: true, default: 0 },
  state_id: { type: Number, required: true, default: 0 },
  name: { type: String, required: true, trim: true },
  status: { type: Number, required: true, trim: true, default: 1 },
});

export default model('City', CitySchema);
