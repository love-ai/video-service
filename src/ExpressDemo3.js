var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));//这个地方
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/index.html', function (req, res) {
  res.sendFile(path.resolve(__dirname, "../index.html"))//访问上一级目录
})

app.post('/process_post', urlencodedParser, function (req, res) {
  let response = {
    // "firstName": req.query.firstName,
    // "lastName": req.query.lastName,
    "firstName": req.body.firstName, "lastName": req.body.lastName,
  }
  res.end(JSON.stringify(response))
})

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
