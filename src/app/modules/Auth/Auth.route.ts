import express from 'express';
import { AuthControllers } from './Auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { LoginValidations } from './Auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(LoginValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/register',
  validateRequest(LoginValidations.registerValidationSchema),
  AuthControllers.registerUser,
);

router.post(
  '/change-passoword',
  validateRequest(LoginValidations.changePasswordValidation),
  AuthControllers.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(LoginValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
