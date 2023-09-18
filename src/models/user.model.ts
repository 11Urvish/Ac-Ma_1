import { model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: 'Company' },
  role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  user_type: { type: String, required: true, trim: true, enum: ['super_admin', 'user'] },
  status: { type: Number, required: true, default: 1 },
  mobile: { type: String, trim: true, required: true, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, trim: true },
  financial_year: { type: String, required: true, trim: true },
  settings: {
    language: { type: String, required: true, trim: true, default: 'en' },
    payment_frequency: { type: String, required: true, trim: true, default: 'monthly' },
  },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_at: { type: Date, default: Date.now },
});

export default model('User', UserSchema);