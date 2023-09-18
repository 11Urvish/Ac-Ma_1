import { model, Schema } from 'mongoose';

const TalukaSchema: Schema = new Schema({
    stateCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    code: { type: Number, required: true },
    name: {
        en: { type: String, required: true, trim: true },
        hi: { type: String, required: true, trim: true }
    },
    status: { type: String, default: 1 },

    createdAt: { type: Date, default: Date.now },

    updatedAt: { type: Date, default: Date.now },
});

export default model('Taluka', TalukaSchema);
