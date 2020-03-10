const { exec } = require("../db/mysql");
const xss = require("xss");

const getList = (keyword, author) => {
  let sql = `select * from blogs where state=1 `;
  if (keyword) {
    sql += `and title like '%${keyword}%'`;
  }
  if (author) {
    sql += `and author='${author}'`;
  }
  sql += `order by createtime desc`;
  return exec(sql);
};

const getDetail = id => {
  let sql = `select * from blogs where id=${id} and state=1`;
  return exec(sql);
};

const newBlog = body => {
  const title = xss(body.title);
  const content = xss(body.content);
  const createtime = +new Date();
  const author = body.author;

  let sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}')`;

  return exec(sql);
};

const updateBlog = body => {
  const id = body.id;
  const title = xss(body.title);
  const content = xss(body.content);

  let sql = `update blogs set title='${title}', content='${content}' where id=${id} `;

  return exec(sql);
};

const delBlog = (id, author) => {
  const sql = `update blogs set state=0 where id='${id}' and author='${author}'`;
  return exec(sql);
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
