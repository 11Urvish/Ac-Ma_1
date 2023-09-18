import { model, Schema } from 'mongoose';

const LoanSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  loanNumber: { type: Number, required: true, trim: true },
  loanAmount: { type: Number, required: true, trim: true },
  //loanType: { type: String, required: true, trim: true },
  interestRate: { type: Number, required: true, trim: true },
  loanStartDate: { type: Date, required: true, trim: true },
  loanEndDate: { type: Date, required: true, trim: true },
  //loanPeriod: { type: Date, required: true, trim: true },
  financialYear: { type: String, required: true, trim: true },
  client: {
    name: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, required: true, trim: true },
    },
    mobile: { type: String, required: true, trim: true },
    address: {
      addressLine1: {
        en: { type: String, required: true, trim: true },
        hi: { type: String, required: true, trim: true },
      },
      state: { type: String, required: true, trim: true },
      district: { type: String },
      taluka: { type: String },
      village: { type: String },
      pincode: { type: String },
    },
  },
  morgageItems: [
    {
      name: { type: String, trim: true },
      quantity: { type: Number, trim: true },
      weight: { type: Number, trim: true },
      purity: { type: Number, trim: true },
      value: { type: Number, trim: true },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Loan', LoanSchema);
