class Auth {
  static async loginSuccess(req, res) {
    return res.status(200)
      .json(req.user);
  }

}

export default Auth;
