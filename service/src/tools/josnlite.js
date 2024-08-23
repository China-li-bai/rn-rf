const fs = require('fs');
const path = require("path")
// 读取文件的所有行
const jsonPath = path.join(__dirname,"./GaoZhongluan_2.json")
console.log({__dirname,jsonPath});
const data = fs.readFileSync(jsonPath, 'utf8').split('\n');

// 解析每一行
const jsonArray = data.filter(line => line.trim()).map(line => JSON.parse(line));


console.log(jsonArray[0]);
const outputJsonPath = path.join(__dirname, './GaoZhongluan_2_output.json');
fs.writeFileSync(outputJsonPath,JSON.stringify(jsonArray,null),"utf-8")