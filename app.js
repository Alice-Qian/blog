const querystring = require("querystring");
const { access } = require("./src/utils/log");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

const SESSION_DATA = {};

// 处理post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (
      req.method !== "POST" ||
      req.headers["content-type"] !== "application/json"
    ) {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

// 设置cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

const serverHandle = async (req, res) => {
  // 记录日志
  access(`${req.method}--${req.url}--${req.headers['user-agent']}--${+new Date()}`)

  res.setHeader("Content-type", "application/json");

  const path = req.url.split("?")[0];
  req.path = path;

  // 解析query
  req.query = querystring.parse(req.url.split("?")[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(":").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 解析session
  let userId = req.cookie.userId;
  let needSetCookie = false;

  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  // 处理post data
  req.body = await getPostData(req);

  // 处理博客路由
  let blogData = await handleBlogRouter(req, res);
  if (blogData) {
    if (needSetCookie) {
      res.setHeader(
        "Set-Cookie",
        `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
      );
      // httpOnly 只允许服务器端改 不允许客户端改
    }
    res.end(JSON.stringify(blogData));
    return;
  }

  // 处理用户路由
  let userData = await handleUserRouter(req, res);
  if (userData) {
    if (needSetCookie) {
      res.setHeader(
        "Set-Cookie",
        `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
      );
      // httpOnly 只允许服务器端改 不允许客户端改
    }
    res.end(JSON.stringify(userData));
    return;
  }

  res.writeHead(404, { "Content-type": "text-plain" });
  res.write("404 NOT FOUND");
  res.end();
};

module.exports = serverHandle;

// process.env.NODE_ENV
