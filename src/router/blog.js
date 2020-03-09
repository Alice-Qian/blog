const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog.js");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("尚未登录！"));
  }
};

const handleBlogRouter = async (req, res) => {
  const method = req.method;
  const path = req.path;

  if (method == "GET" && path == "/api/blog/list") {
    let author = req.query.author || "";
    const keyword = req.query.keyword || "";

    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
        return loginCheckResult
    }
    author = req.session.username
    const data = await getList(keyword, author);
    return new SuccessModel(data);
  }

  if (method == "GET" && path == "/api/blog/detail") {
    const id = req.query.id || "";
    let data = await getDetail(id);
    return new SuccessModel(data[0]);
  }

  if (method === "POST" && path == "/api/blog/new") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
        // 未登录
        return loginCheckResult
    }

    req.body.author = req.session.username;
    let data = await newBlog(req.body);
    return new SuccessModel(data.insertId);
  }

  if (method === "POST" && path == "/api/blog/update") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
        return loginCheckResult
    }

    let data = await updateBlog(req.body);

    if (data.affectedRows > 0) {
      return new SuccessModel(true);
    } else {
      return new ErrorModel("更新失败");
    }
  }

  if (method === "GET" && path == "/api/blog/del") {
    let id = req.query.id || "";
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
        return loginCheckResult
    }

    const author = req.session.username;

    let data = await delBlog(id,author);

    if (data.affectedRows > 0) {
      return new SuccessModel(true);
    } else {
      return new ErrorModel("删除失败");
    }
  }
};

module.exports = handleBlogRouter;
