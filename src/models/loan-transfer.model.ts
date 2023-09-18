import { model, Schema } from 'mongoose';

const LoanTransferSchema: Schema = new Schema({
  firm: { type: Schema.Types.ObjectId, ref: 'Firm' },
  bundle_number: { type: Number, required: true },
  amount: { type: Number, required: true },
  interest_rate: { type: Number, required: true },
  status: { type: Number, required: true },
  transfer_date: { type: Date, required: true, default: Date.now },
  total_weight: { type: String, default: '' },
  total_item: { type: String, default: '' },
  loan_items: [{
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customer_name: { type: String, required: true },
    loan_number: { type: Number, required: true },
    loan_amount: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    status: { type: Number, required: true, default: 1 },
  }],
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'loan_transfers' });

export default model('LoanTransfer', LoanTransferSchema);