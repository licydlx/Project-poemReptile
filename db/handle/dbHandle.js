var express = require('express');
var app = express();
var fs = require("fs");
var User = require("../model/dbModel.js");
var mongooseModel = User.Usermodal,
UserSchema = User.UserSchema,
db = User.db;

// 添加 mongoose 实例方法
UserSchema.methods.findbyusername = function(username, callback) {
    return this.model('user').find({username: username}, callback);
}

// 添加 mongoose 静态方法，静态方法在Model层就能使用
UserSchema.statics.findbytitle = function(username, callback) {
    return this.model('user').find({username: username}, callback);
};

/**
 * 插入
 */
var user = {
    username: 'bb',
    //用户账号
    userpwd: 'bb',
    //密码
    userage: 17,
    //年龄
    logindate: new Date() //最近登录时间
};

mongooseModel.create(user,function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('save ok');
    }
    // 关闭数据库链接
    db.close();
});

/* function getByConditions(){
    var wherestr = {'username' : 'bb'};
    
    mongooseModel.find(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
            return res;
        }
    })
}

getByConditions();*/

app.get('/haha', function (req, res) {
    console.log("我执行了");
    var wherestr = {'username' : 'bb'};
    mongooseModel.find(wherestr, function(err, res){
      console.log("你好");
        if (err) {
            console.log("Error:" + err);
        }else {
            console.log("Res:" + res);
        }  
    });
});


var server = app.listen(8081,function() {
    var host = server.address().address
    var port = server.address().port 
    console.log(host);
    console.log(port);
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});