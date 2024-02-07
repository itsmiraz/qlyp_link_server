import { Router } from 'express';
import { URLControllers } from './url.controller';
import validateRequest from '../../middlewares/validateRequest';
import { URLValidation } from './url.validation';

const router = Router();
const urlAccessRouter = Router();

router.post(
  '/create-short-url',
  validateRequest(URLValidation.createShortUrlSceham),
  URLControllers.createShortUrl,
);

urlAccessRouter.get('/:key', URLControllers.accessSortUrl);

export const urlAccessRoutes = urlAccessRouter;
export const UrlRoutes = router;
