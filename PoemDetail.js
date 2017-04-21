var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mkdirp = require('mkdirp');

//本地存储目录
var dir = './images';
var test = [];


//POEM  爬取
var PoemDetails = function(sn, url, dynasty) {
    var sn = sn;
    var outputFilename = './json/'+sn+'.json';
    //创建目录
    mkdirp(dir, function(err) {
        if (err) {
            console.log(err);
        }
    });
    
    console.log('sn==================' + sn);
    //Promise --start
    /*Promise 实例化*/
    /*return new Promise(function(resolve, reject) {*/
    var promise = new Promise(function(resolve, reject) {
            //异步获取数据 
            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    //返回请求页面的HTML
                    var $ = cheerio.load(body);
                    /*======================================*/

                    //诗词题目
                    var poemTitle,
                        //诗人朝代
                        poetDy,
                        //诗词作者
                        poet,
                        //爬取下来的诗文
                        poemOriginArr,
                        //爬取下来的诗文de数组形式
                        poemArr,
                        //诗过滤的参数
                        poemFilter,
                        //诗过滤的参数的小标数组
                        poemSubArr,
                        //加工后的完美诗文
                        poemPerfect,
                        //此js的返回值--诗文细节
                        poemDetail,
                        //诗人美图Url
                        imgUrl,
                        //诗人 本地图名
                        localImgName;

                    /*======================================*/
                    //诗 被爬取 序列号
                    reptileId = dynasty + '-' + sn;
                    //诗词题目
                    poemTitle = $('.son1 > h1').text().replace(/(^\s*)|(\s*$)/g, "");
                    //诗人朝代
                    poetDy = $('.son2 > p:nth-child(2)').text().substring($('.son2 > p:nth-child(2)').text().indexOf('：') + 1).replace(/(^\s*)|(\s*$)/g, "");
                    //诗词作者
                    poet = $('.son2 > p:nth-child(3)').text().substring($('.son2 > p:nth-child(3)').text().indexOf('：') + 1).replace(/(^\s*)|(\s*$)/g, "");
                    //诗词原文
                    poemOriginArr = $('#cont').text().split("");
                    //诗人美图Url
                    /*console.log('诗人美图Url' + poet);*/
                    imgUrl = $('img[alt = "' + poet + '"]').attr('src');
                    /*console.log(imgUrl);*/
                    if (imgUrl !== undefined) {
                        //诗人 本地图名
                        localImgName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
                    } else {
                        localImgName = null;
                    }

                    poemFilter = ['(', ')'];
                    //获取字符串的下标数组
                    poemSubArr = (function() {
                        var poemSubArr = [];
                        for (i in poemOriginArr) {
                            if (poemOriginArr[i] == poemFilter[1] || poemOriginArr[i] == poemFilter[0]) {
                                poemSubArr.push(i);
                            }
                        }
                        return poemSubArr;
                    })(poemFilter, poemOriginArr);

                    //将原文字符串转为数组
                    poemArr = (function() {
                        // 全诗文--字符串
                        var poemOriginSt,
                            // 诗文--数组
                            poemArr;
                        poemOriginSt = poemOriginArr.join('');
                        poemArr = [poemOriginSt];
                        for (var i = 0, len = poemSubArr.length; i < len; i = i + 2) {
                            var poemSubPr = parseInt(poemSubArr[i]);
                            var poemSubNe = parseInt(poemSubArr[i + 1]) + 1;
                            poemArr.push(poemOriginSt.slice(poemSubPr, poemSubNe));
                        }
                        return poemArr;
                    })(poemSubArr);

                    //删去带括号的字符串,返回完美诗文
                    poemPerfect = poemArr.reduce(function(x, y) {
                        return x.replace(y, '').replace(/(^\s*)|(\s*$)/g, "");
                    }).replace(/(^\s*)|(\s*$)/g, "");
                    //诗文详情
                    poemDetail = {
                        reptileId: reptileId,
                        title: poemTitle,
                        dynasty: poetDy,
                        poet: poet,
                        poem: poemPerfect,
                        imgUrl: imgUrl,
                        localImgName: localImgName
                    };
                    resolve(poemDetail, sn);
                };
            });
        })
        /*.then(function(data) {*/

    //处理异步获得的数据
    promise.then(function(data, sn) {
        /*console.log('content:' + data.reptileId);
        console.log('content:' + data.dynasty);
        console.log('content:' + data.localImgName);*/
        /*if (test.length == 10) {
            console.log('test-net' + test);
            test = [];
        }

        test.push(data.poet);
        console.log('' + sn + '------------test----' + test);
        console.log('-------------------------------');*/

        test.push(data);
        if (test.length == 20) {
            fs.writeFile(outputFilename, JSON.stringify(test, null, 2), function(err) {
                if (err) {
                    console.log(err);
                } else {
                    test = [];
                    console.log(test);
                    console.log("JSON saved to " + outputFilename);
                }
            });
        }
        /*console.log('content:' + data.poem);*/
        /*console.log(Math.floor(Math.random()*100000) + data.imgUrl.substr(-4,4));*/
        /*console.log(filename);*/
        /*download(data.imgUrl, dir,filename);*/

    }, function(error) {
        console.error('err:', error);
    });

    /*Promise --end*/
};

//
var download = function(url, dir, filename) {
    console.log('download');
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};



//模块导出
module.exports = PoemDetails;