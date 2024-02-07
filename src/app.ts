import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/not-found';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { URLControllers } from './app/modules/Url/url.controller';

const app: Application = express();

//parser
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use(cookieParser());

// Application Routes

app.use('/api', router);

app.get('/:key', URLControllers.accessSortUrl);
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.get('/not-found', (req: Request, res: Response) => {
  res.send('Could Not Found Your Long Url');
});

app.use(globalErrorHandler);
// Not Found

app.use(notFound);

export default app;
