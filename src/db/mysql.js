const mysql = require('mysql');
const {
    MYSQL_CONF
} = require('../conf/db');


const con = mysql.createConnection(MYSQL_CONF);

con.connect();

function exec(sql) {
    return new Promise((reslove, reject) => {
        con.query(sql, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            reslove(res);
        })
    })
}

module.exports = {
    exec
}