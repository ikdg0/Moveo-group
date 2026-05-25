import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName:    { type: String, required: true, trim: true, maxlength: 80 },
    lastName:     { type: String, required: true, trim: true, maxlength: 80 },
    email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone:        { type: String, required: true, trim: true, maxlength: 40 },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
