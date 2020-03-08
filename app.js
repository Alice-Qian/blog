const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session 数据
const SESSION_DATA = {};

// cookie 过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (1000 * 60 * 60 * 24));
    return d.toUTCString();
}

// 用于处理post data
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}


const serverHandle = async (req, res) => {

    res.setHeader('Content-type', 'application/json');

    const url = req.url;
    req.path = url.split('?')[0];

    // 解析query
    req.query = querystring.parse(url.split("?")[1]);

    // 解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(':').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });

    // 解析 session
    let userId = req.cookie.userId;
    let needSetCookie = false;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];

    // 处理post data
    req.body = await getPostData(req);

    const blogData = await handleBlogRouter(req, res);
    if (blogData) {
        if (needSetCookie) {
            res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
            // httpOnly 只允许服务器端改 不允许客户端改
        }
        res.end(JSON.stringify(blogData));
        return;
    }

    const userData = await handleUserRouter(req, res);
    if (userData) {
        if (needSetCookie) {
            res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
            // httpOnly 只允许服务器端改 不允许客户端改
        }
        res.end(JSON.stringify(userData));
        return;
    }

    res.writeHead(404, {
        "Content-type": "text/plain"
    })
    res.write("404 Not Found\n")
    res.end()
}

module.exports = serverHandle