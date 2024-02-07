import axios from 'axios';
import config from '../../config';
import { generateKey } from '../../utils/generateKey';
import { TURL } from './url.interface';
import { Url } from './url.model';
import AppError from '../../errors/AppError';

const createShortUrlIntoDb = async (payload: TURL) => {
  // check if the url is working or not
  try {
    const response = await axios.get(payload?.longUrl);
    if (response.status === 200) {
      // create the 4-5 digit uniqe key
      const key = generateKey(5);

      // create a new shorturl object
      const newShortUrl = {
        longUrl: payload.longUrl,
        shortUrl: `${config.redirect_base_url}/${key}`,
        email: payload.email || '',
        isActive: true,
      };
      // save to the db
      const result = await Url.create(newShortUrl);
      return result;
    } else {
      throw new AppError(404, 'Please provide an working URL');
    }
  } catch (error) {
    throw new AppError(500, 'Please provide an working URL or try again later');
  }
};

const accessShortUrlFromDb = async (key: string) => {
  const shortUrl = `${config.redirect_base_url}/${key}`;

  const result = await Url.findOne({ shortUrl: shortUrl });

  return result;
};

export const URLServices = {
  createShortUrlIntoDb,
  accessShortUrlFromDb,
};
