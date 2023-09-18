import { model, Schema } from 'mongoose';

const TransactionSchema: Schema = new Schema(
  {
    transaction_id: { type: String, required: true, unique: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    loan_id: { type: Schema.Types.ObjectId, ref: 'Loan', default: '' },
    amount: { type: Number, required: true },
    interest_amount: { type: Number, required: true },
    principal_amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    transaction_type: { type: Number, required: true },
    is_interest_paid: { type: Boolean, required: true, default: false },
    preceding_hash: { type: String, required: true },
    hash: { type: String, required: true },
    payment_date: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: 'transaction' }
);

export default model('Transaction', TransactionSchema);