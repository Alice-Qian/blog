const fs = require("fs");
const path = require("path");
const readline = require("readline");

const fileName = path.join(__dirname, "../", "../", "logs", "access.log");

// 创建readStream
const readStream = fs.createReadStream(fileName);

// 创建readline 对象
const rl = readline.createInterface({
  input: readStream
});

let num = 0;
let sum = 0;
rl.on("line", lineData => {
  if (!lineData) {
    return;
  }
  // 记录总行数
  sum++;
  const arr = lineData.split("--");
  if (arr[2] && arr[2].indexOf('Postman') > -1) {
    num++;
  }
});

rl.on("close", () => {
  console.log(num);
});
