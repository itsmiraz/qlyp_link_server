/* eslint-disable no-unused-vars */

import { Model } from 'mongoose';

export interface TUser {
  name: string;
  email: string;
  password: string;
}
export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    HashedPassword: string,
  ): Promise<boolean>;
}
