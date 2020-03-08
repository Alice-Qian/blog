const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录！')
        )
    }
}

const handleBlogRouter = async (req, res) => {
    const method = req.method;
    const id = req.query.id;

    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';

        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                return loginCheckResult
            }
            author = req.session.username
        }

        const listData = await getList(author, keyword);
        return new SuccessModel(listData);
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
        const data = await getDetail(id);
        return new SuccessModel(data);
    }

    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }

        req.body.author = req.session.username;
        const data = await newBlog(req.body);
        return new SuccessModel(data);
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = await updateBlog(id,req.body);
        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('更新博客失败');
        }
    }

    if (method === 'GET' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }

        const author = req.session.username;
        const result = await delBlog(id, author);

        if (result) {
            return new SuccessModel();
        } else {
            return new ErrorModel('删除博客失败');
        }
    }
}

module.exports = handleBlogRouter