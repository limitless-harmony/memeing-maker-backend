import jwt from 'jsonwebtoken';
import keys from '../config/keys';

const { secret, expiresIn } = keys.jwt;

class Token {
  static sign(user) {
    const { id } = user;
    return jwt.sign({ id, expiresIn }, secret);
  }
}

export default Token;
