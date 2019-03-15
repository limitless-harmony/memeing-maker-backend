/* eslint-disable */

class Auth {
  // eslint-disable-next-line require-jsdoc
  static async loginSuccess(req, res) {
    return res.status(200)
      .json(req.user);
  }

}

export default Auth;
