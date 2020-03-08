const {
    login
} = require('../controller/user')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')


const handleUserRouter = async (req, res) => {
    const method = req.method;
    if (method === 'POST' && req.path === '/api/user/login') {
        const {
            username,
            password
        } = req.body;

        const result = await login(username, password);

        if (result.username) {
            req.session.username = result.username;
            req.session.realname = result.realname;

            return new SuccessModel();
        } else {
            return new ErrorModel('登录失败');
        }
    }

    // 登录验证的测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     console.log(req.session)
    //     if (req.session.username) {
    //         return Promise.resolve(
    //             new SuccessModel({
    //                 session: req.session
    //             })
    //         )
    //     }
    //     return new ErrorModel();
    // }

    if (method === 'POST' && req.path === 'api/user/reg') {
        return {
            msg: "这是注册的接口"
        }
    }
}

module.exports = handleUserRouter;