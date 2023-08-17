import jwt from 'jsonwebtoken';
import { jwtConstants } from '../helpers/constanst';

const jwtSign = (payload) => {
  return jwt.sign(payload, jwtConstants.secret, { expiresIn: '365 days' });
};

const jwtVerify = (token) => {
  return jwt.verify(token, jwtConstants.secret);
};

export { jwtSign, jwtVerify };
