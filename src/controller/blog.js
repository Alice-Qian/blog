const {
    exec
} = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where state=1`;
    if (author) {
        sql += `and author = ${author} `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'`
    }
    return exec(sql);
}

const getDetail = (id) => {
    const sql = `select * from blogs where state=1 and id='${id}'`;
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createtime = Date.now();

    const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createtime}',${author}')`;

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    const title = blogData.title;
    const content = blogData.content;

    const sql = `update blogs set title='${title}',content='${content}' where id='${id}'`;

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

const delBlog = (id, author="") => {
    const sql = `update blogs set state=0 where id='${id}' and author='${author}'`;
   
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}