import config from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { URLServices } from './url.servicee';

const createShortUrl = catchAsync(async (req, res) => {
  const result = await URLServices.createShortUrlIntoDb(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Url Shortened SuccessFully',
    data: result,
  });
});
const accessSortUrl = catchAsync(async (req, res) => {
  const key = req.params.key;

  const result = await URLServices.accessShortUrlFromDb(key);
  //   console.log(result);
  const redirectURl =
    result?.longUrl || `${config.redirect_base_url}/not-found`;
  res.redirect(redirectURl);
});

export const URLControllers = {
  createShortUrl,
  accessSortUrl,
};
