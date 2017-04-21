/**
 * 用户信息
 */
var dbcn = require('../connect/dbConnect.js'),
mongoose = dbcn.mongoose,
db = dbcn.db,
UserSchema = new mongoose.Schema({          
    username : { type: String },                    //用户账号
    userpwd: {type: String},                        //密码
    userage: {type: Number},                        //年龄
    logindate : { type: Date}                       //最近登录时间
}),
Usermodal = db.model('User',UserSchema);

exports.Usermodal = Usermodal;
exports.UserSchema = UserSchema;
exports.db = db;