import { model, Schema } from 'mongoose';

const StateSchema: Schema = new Schema({

    code: { type: Number, required: true },
    name: {
        en: { type: String, required: true, trim: true },
        hi: { type: String, required: true, trim: true }
    },
    status: { type: String, default: 1 },

    createdAt: { type: Date, default: Date.now },

    updatedAt: { type: Date, default: Date.now },
});

export default model('State', StateSchema);
