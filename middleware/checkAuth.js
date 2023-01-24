import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-error.js';

dotenv.config();

export default (req, res, next) => {
  const token = (req.headers.Authorization || '').replace(/Bearer\s?/, '');

  console.log(token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;
      next();
    } catch (err) {
      console.log(err);
      throw new CustomAPIError('No access', StatusCodes.FORBIDDEN);
    }
  } else {
    throw new CustomAPIError('No access', StatusCodes.FORBIDDEN);
  }
};
