const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sql = require("./MysqlDemo");
const date = require("./DateUtil");
const app = express();

app.use(express.static(__dirname));//这个地方
const jsonParser = bodyParser.json({extended: false});


app.post('/login', jsonParser, function (req, res) {
  let response = getResponse();
  let mobile = req.body.mobile;
  let password = req.body.password;
  if (mobile) {
    sql.queryUserByMobile(mobile, function (err, result) {
      if (err) {
        response.code = 1;
        response.msg = err;
      } else {
        if (result.password === password) {
          response.data.user = result
        } else {
          response.code = 2;
          response.msg = "密码错误";
        }
      }
      res.end(JSON.stringify(response))
    })
  } else {
    response.code = 1;
    response.msg = "请输入手机号";
    res.end(JSON.stringify(response))
  }
})

app.get('/getVideoList', function (req, res) {
  let response = getResponse();
  let userId = req.query.userId;
  sql.queryUserById(userId, function (err, result) {
    if (err) {
      response.code = 1;
      response.msg = err;
      res.end(JSON.stringify(response))
    } else if (result.user_type === 2) {
      response.code = 1002;
      response.msg = "您没有查看视频的权限";
      res.end(JSON.stringify(response))
    } else {
      sql.queryVideoList(function (err, result) {
        if (err) {
          response.code = 1;
          response.msg = err;
        } else {
          response.data.videoList = result
        }
        res.end(JSON.stringify(response))
      })
    }
  })
});

app.post('/likeVideo', jsonParser, function (req, res) {
  let response = getResponse();
  let data = {
    "user_id": req.body.user_id,
    "video_id": req.body.video_id,
    "like_type": req.body.like_type,
    "like_time": date.dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
  }
  //打log
  sql.insertAndUpdateLikeLog(data, function (err, result) {
    if (err) {
      console.log(err);
      response.code = 1;
      response.msg = err;
      res.end(JSON.stringify(response))
    }
  })
  // 更新视频的点赞数
  sql.getVideoLikeCount(data.video_id, function (err, result) {
    if (err) {
      response.code = 1;
      response.msg = err;
      res.end(JSON.stringify(response))
    } else {
      let like_num = result[0].like_num;
      let unlike_num = result[0].unlike_num;
      sql.updateVideoLikeCount(like_num, unlike_num, data.video_id, function (err, result) {
        if (err) {
          response.code = 1;
          response.msg = err;
        }
        res.end(JSON.stringify(response))
      })
    }
  })
})


app.get('/index.html', function (req, res) {
  res.sendFile(path.resolve(__dirname, "../index.html"))//访问上一级目录
})

function getResponse() {
  return {
    "code": 0,
    "msg": "success",
    "data": {}
  }
}

const server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
