import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/Auth.route';
import { UrlRoutes, urlAccessRoutes } from '../modules/Url/url.route';

const router = Router();

const ModuleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/short-url',
    route: UrlRoutes,
  },

  {
    path: '/',
    route: urlAccessRoutes,
  },
];

ModuleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
