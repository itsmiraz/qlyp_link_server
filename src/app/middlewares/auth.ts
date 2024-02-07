import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
    }

    const { email } = decoded;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError(404, 'User Not Found');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
