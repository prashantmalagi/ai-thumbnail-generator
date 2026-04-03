import mongoose from 'mongoose';

export interface IGeneration extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    style: string;
    aspectRatio: string;
    colorScheme: string;
    additionalDetails?: string;
    imageData: string;   // base64 data URL  e.g. "data:image/jpeg;base64,..."
    prompt: string;      // full prompt sent to Gemini, useful for debugging
    createdAt: Date;
    updatedAt: Date;
}

const GenerationSchema = new mongoose.Schema<IGeneration>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    style: { type: String, required: true },
    aspectRatio: { type: String, default: '16:9' },
    colorScheme: { type: String, default: 'Vibrant' },
    additionalDetails: { type: String, default: '' },
    imageData: { type: String, required: true },
    prompt: { type: String, required: true },
}, { timestamps: true });

const Generation = mongoose.models.Generation ||
    mongoose.model<IGeneration>('Generation', GenerationSchema);

export default Generation;
