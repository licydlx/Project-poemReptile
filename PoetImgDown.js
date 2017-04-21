//依赖模块
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
//创建目录
var dir = './images';
mkdirp(dir, function(err) {
    if (err) {
        console.log(err);
    }
});

var PoetImgDown = function(value) {
    //图片url
    var imgUrl,
        //下载的图片,本地名字
        imgDownName;
    //
    for (var i = 0, dil = value.length; i < dil; i++) {
        imgUrl = value[i].imgUrl;
        imgDownName = value[i].localImgName;

        if (imgUrl !== undefined || imgDownName !== null) {
            imgDownload(imgUrl, dir, imgDownName);
        }
    }
};

//图片下载方法
var imgDownload = function(url, dir, filename) {
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};
//模块导出
module.exports = PoetImgDown;