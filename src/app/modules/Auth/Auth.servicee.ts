import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './Auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { createToken } from './Auth.utils';
import jwt from 'jsonwebtoken';
import { TUser } from '../user/user.interface';

const continueWithGoogle = async (email: string) => {
  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    // Login User
  } else {
    //register user
  }
};

const loginUser = async (payload: TLoginUser) => {
  const isUserExists = await User.findOne({ email: payload.email }).select(
    '+password',
  );

  if (!isUserExists) {
    throw new AppError(404, 'User Not Found');
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    isUserExists.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
  }

  const jwtPayload = {
    email: isUserExists.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    user: isUserExists,
  };
};

const registerUserIntoDb = async (payload: TUser) => {
  const result = await User.create(payload);
  const jwtPayload = {
    email: result.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    user: result,
  };
};

const changePasswordIntoDb = async (
  user: JwtPayload,
  payload: { oldPassword: string; password: string },
) => {
  const isUserExists = await User.findOne({ email: user.email }).select(
    '+password',
  );
  if (!isUserExists) {
    throw new AppError(404, 'User Not Found');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    isUserExists.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
  }

  // hash new Pass
  const newHashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChanged: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
  }

  const { email } = decoded;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User Not Found');
  }

  const jwtPayload = {
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
  changePasswordIntoDb,
  refreshToken,
  registerUserIntoDb,
  continueWithGoogle,
};
