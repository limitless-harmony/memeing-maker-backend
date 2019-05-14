import jwt from 'jsonwebtoken';
import keys from '../config/keys';

const { secret, expiresIn } = keys.jwt;

class Token {
  static async sign(user) {
    const { id, role } = user;
    return jwt.sign({ id, role, expiresIn }, secret);
  }

  static async verify(token) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}

export default Token;
