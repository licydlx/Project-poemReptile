var mongoose = require('mongoose');
/**
 * 连接
 */
var db = mongoose.createConnection('mongodb://localhost:27017/bmyy');
/**
 * 连接成功
 */
db.on('connected',function() {
  console.log('Mongoose connection open to ' + 'mongodb://localhost:27017/bmyy');
});
/**
 * 连接错误
 */
db.on('error',function(error) {
  console.log('Mongoose connection' + error);
});

exports.mongoose = mongoose;
exports.db = db;