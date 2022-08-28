var mysql = require('mysql');
var connection = mysql.createConnection({
  name: 'database-3.cknl2c6ecure.ap-northeast-1.rds.amazonaws.com',
  host: 'database-3.cknl2c6ecure.ap-northeast-1.rds.amazonaws.com',
  user: 'admin',
  password: 'carlwe.com',
  port: '3306',
  database: 'test',
  useConnectionPooling: true
})


function connect() {
  connection.connect();
}

function connectEnd() {
  connection.end();
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


exports.addUser = function (name, mobile, res) {
  connect();
  let response = {
    "code": 0,
    "msg": "success",
    "data": {
      "res": "hello rn"
    }
  }
  console.log(name + "****" + mobile)
  const sql = 'INSERT INTO user(id,name,mobile,user_type) VALUES(0,?,?,?)';
  const addSqlParams = [name, mobile, '1']
  connection.query(sql, addSqlParams, function (err, result) {
    connectEnd();
    if (err) {
      response.code = 1;
      response.msg = err.message;
      console.log('[SELECT ERR]--', err.message);
    }
    res.end(JSON.stringify(response))
  })
}
