const { login } = require("../controller/user.js");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleUserRouter = async (req, res) => {
  const method = req.method;
  const path = req.path;

  if (method == "POST" && path == "/api/user/login") {
    const { username, password } = req.body;

    let data = await login(username, password);

    data=data[0]
  
    if (data.username) {
      req.session.username = data.username;
      req.session.realname = data.realname;
      return new SuccessModel();
    }

    return new ErrorModel("登陆失败");
  }
};

module.exports = handleUserRouter;
