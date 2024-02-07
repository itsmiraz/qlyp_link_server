import config from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import { AuthServices } from './Auth.servicee';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res
    .cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: 'User Logged in successfully ',
      data: {
        accessToken,
        user: user,
      },
    });
});

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserIntoDb(req.body);

  const { refreshToken, accessToken, user } = result;

  res
    .cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    })
    .status(201)
    .json({
      success: true,
      message: 'User Registered in successfully ',
      data: {
        accessToken,
        user,
      },
    });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePasswordIntoDb(
    req.user,
    passwordData,
  );

  res.status(200).json({
    success: true,
    message: 'Password Changed successfully ',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Access Token Retrived successfully ',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  registerUser,
};
