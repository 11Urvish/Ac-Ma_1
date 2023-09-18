import { model, Schema } from 'mongoose';

const FirmSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  contact_person: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  status: { type: Number, required: true, trim: true, default: 1 },
  note: { type: String, trim: true, default: '' },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_at: { type: Date, default: Date.now },
});

export default model('Firm', FirmSchema);