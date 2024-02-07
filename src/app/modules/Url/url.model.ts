import { Schema, model } from 'mongoose';
import { TURL } from './url.interface';

const urlScehma = new Schema<TURL>({
  shortUrl: {
    type: String,
    unique: true,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

export const Url = model<TURL>('Url', urlScehma);
