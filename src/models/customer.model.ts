import { model, Schema } from 'mongoose';

const CustomerSchema: Schema = new Schema({
  licence: {
    licenceNumber: { type: String, required: true, trim: true },
    licenceType: { type: String, required: true, trim: true, default: 'lonar' },
    licenceExpiryDate: { type: Date, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    taluka: { type: String, required: true, trim: true },
  },
  name: {
    en: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true },
  },
  email: { type: String, trim: true },
  mobile: { type: String, required: true, trim: true },
  address: {
    addressLine1: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, required: true, trim: true },
    },
    state: { type: String, required: true, trim: true },
    city: { type: String },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    pincode: { type: String },
  },
  status: { type: String, default: 1 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Customer', CustomerSchema);
