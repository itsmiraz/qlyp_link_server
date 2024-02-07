import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: 0,
      required: [true, 'Password is Required'],
      maxlength: [20, 'Password can not be more than 20 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Pre save middleware /hook
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //document
  // Hashing user password and save to the db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

//post save middleware /hook
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  HashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, HashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
