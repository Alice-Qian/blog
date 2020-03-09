const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/db");

// 创建链接
const con = mysql.createConnection(MYSQL_CONF);

// 开始链接
con.connect();

// 统一执行 sql 的函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
  return promise;
}

module.exports = {
  exec,
  escape: mysql.escape
};
