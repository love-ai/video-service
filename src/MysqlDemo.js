var mysql = require('mysql');
const {query} = require("express");
var pool = mysql.createPool({
  name: 'database-3.cknl2c6ecure.ap-northeast-1.rds.amazonaws.com',
  host: 'database-3.cknl2c6ecure.ap-northeast-1.rds.amazonaws.com',
  user: 'admin',
  password: 'carlwe.com',
  port: '3306',
  database: 'test',
  connectionLimit: 10,
})

exports.queryUserByMobile = function (mobile, callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'SELECT * FROM user WHERE mobile = ?';
    const addSqlParams = [mobile]
    connection.query(sql, addSqlParams, function (err, result) {
      connection.release();
      if (err || !result) {
        callback(err.message, null)
      } else if (result.length === 0) {
        callback("请输入正确的手机号", {})
      } else {
        callback(null, result[0])
      }
    })
  });
}

exports.queryUserById = function (id, callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'SELECT * FROM user WHERE id = ?';
    const addSqlParams = [id]
    connection.query(sql, addSqlParams, function (err, result) {
      connection.release();
      if (err || !result) {
        callback(err.message, null);
      } else if (result.length === 0) {
        callback("未找到用户", {})
      } else {
        callback(null, result[0])
      }
    })
  });
}

exports.queryVideoList = function (callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'SELECT v.*,like_type\n' +
      'FROM like_log AS l\n' +
      'RIGHT JOIN  video AS v\n' +
      'ON v.id = l.video_id and l.user_id = 1';
    connection.query(sql, function (err, result) {
      connection.release();
      if (err || !result) {
        callback(err.message, null)
      } else {
        callback(null, result)
      }
    })
  });
}

exports.insertAndUpdateLikeLog = function (data, callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'INSERT INTO like_log(log_id,user_id,video_id,like_type,update_time) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE like_type = ?'
    const addSqlParams = [data.user_id + "_" + data.video_id, data.user_id, data.video_id, data.like_type, data.like_time, data.like_type];
    connection.query(sql, addSqlParams, function (err, result) {
      if (err) {
        callback(err.message, null)
      } else {
        callback(null, result)
      }
    });
  });
}

exports.getVideoLikeCount = function (video_id, callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'select COUNT(CASE WHEN video_id=? and like_type=1 THEN 1 END) AS like_num, COUNT(CASE WHEN video_id=? and like_type=2 THEN 1 END) AS unlike_num from like_log';
    const addSqlParams = [video_id, video_id];
    connection.query(sql, addSqlParams, function (err, result) {
      if (err) {
        callback(err.message, null)
      } else {
        callback(null, result)
      }
    });
  });
}

exports.updateVideoLikeCount = function (like_num, unlike_num, video_id, callback) {
  pool.getConnection(function (err, connection) {
    const sql = 'UPDATE video SET like_num = ? ,unlike_num = ? WHERE id = ?';
    const addSqlParams = [like_num, unlike_num, video_id];
    connection.query(sql, addSqlParams, function (err, result) {
      if (err) {
        callback(err.message, null)
      } else {
        callback(null, result)
      }
    });
  });
}


// const sql = 'SELECT * FROM user'
//
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log('[SELECT ERR]--', err.message);
//     return;
//   }
//   console.log('----------------SELECT---------------')
//   console.log(result);
//   console.log('----------------SELECT---------------\n\n')
// })


// exports.addUser = function (name, mobile, res) {
//   connect();
//   let response = {
//     "code": 0,
//     "msg": "success",
//     "data": {
//       "res": "hello rn"
//     }
//   }
//   console.log(name + "****" + mobile)
//   const sql = 'INSERT INTO user(id,name,mobile,user_type) VALUES(0,?,?,?)';
//   const addSqlParams = [name, mobile, '1']
//   connection.query(sql, addSqlParams, function (err, result) {
//     connectEnd();
//     if (err) {
//       response.code = 1;
//       response.msg = err.message;
//       console.log('[SELECT ERR]--', err.message);
//     }
//     res.end(JSON.stringify(response))
//   })
// }
