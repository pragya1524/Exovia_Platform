import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileData: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ userId: 1, createdAt: -1 });

export const File = mongoose.model<IFile>('File', fileSchema); 