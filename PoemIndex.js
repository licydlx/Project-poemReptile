/*
                          ~~%%%%%%%%_,_,                                                                                            
                       ~~%%%%%%%%%-"/./                                                                                             
                     ~~%%%%%%%-'   /  `.                                                                                            
                  ~~%%%%%%%%'  .     ,__;                                                                                        
                ~~%%%%%%%%'   :       \O\                                                                                        
              ~~%%%%%%%%'    :          `.                                                                                          
           ~~%%%%%%%%'       `. _,        '                                                                                         
        ~~%%%%%%%%'          .'`-._        `.                                                                                 
     ~~%%%%%%%%%'           :     `-.     (,;                                                                                        
    ~~%%%%%%%%'             :         `._\_.'                                                                                   
    ~~%%   %%'              ;                                                                                                                                                                                                                 
*/
// js 依赖模块
var poemPageAnalysis = require('./PoemPageAnalysis.js');
var PoemStoreJson = require('./PoemStoreJson.js');
var PoetImgDown = require('./PoetImgDown.js');
// npm依赖模块
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
//被爬取的网站
var url = 'http://www.gushiwen.org/';

function getChapter(i) {
    var i = i;
    if (i > 11) {
        return false;
    }
    //爬取得朝代的总数
    var dynastyLength,
        //当前爬取得朝代
        dynasty,
        //爬取的朝代的Url
        dynastyUrl,
        //当前第几个朝代
        pageNum,
        //当前朝代 含有诗的总数 文本
        PoemTotalNum,
        //当前朝代 含有诗的总数
        PoemTotalLength,
        poem_chain,
        //诗的详情页 Url
        poem_url;
    //诗的页面总数 Url

    //异步请求朝代列表页
    rp(url).then(function(body) {
            var $ = cheerio.load(body);
            //获取第N个朝代的内容
            dynastyLength = $('.main2 > .cont > a').length;
            dynasty = $('.main2 > .cont > a')[i].attribs.href.substring($('.main2 > .cont > a')[i].attribs.href.lastIndexOf('=') + 1);
            pageNum = i + 1;
            dynastyUrl = 'http://so.gushiwen.org/type.aspx?p=' + pageNum + '&c=' + dynasty + '';
            //朝代页 返回值
            return [dynastyLength, dynasty, pageNum, dynastyUrl];
        }).then(function(value) {
            //该朝代 诗的页面总数 返回值
            return rp(value[3]).then(function(body) {
                var $ = cheerio.load(body);
                var PoemListArray = [];
                var sub;
                PoemTotalNum = $('.typeleft .pages span:last-child').text();
                PoemTotalLength = PoemTotalNum.substring(PoemTotalNum.indexOf('共') + 1, PoemTotalNum.indexOf('篇'));
                for (var i = 0; i < 6; i++) {
                    sub = i + 1;
                    PoemListArray.push('http://so.gushiwen.org/type.aspx?p=' + sub + '&c=' + value[1] + '');
                }
                // 返回值
                return PoemListArray;
            })
        }).then(function(value) {
            //该朝代 诗的详细信息所在Url集合 返回值
            return value.reduce(function(sequence, value) {
                return sequence.then(function() {
                    return rp(value);
                }).then(function(body) {
                    //获取第N个朝代第N页第N条的内容
                    var $ = cheerio.load(body);
                    var poem_url_arr = [];
                    $('.typeleft .sons').map(function(index, value) {
                        if (value.children.length == 9) {
                            poem_chain = value.children[0].next.children[0].attribs.href;
                        } else {
                            poem_chain = value.children[2].next.children[0].attribs.href;
                        }
                        poem_url = 'http://so.gushiwen.org' + poem_chain;
                        poem_url_arr.push(poem_url);
                    });
                    // 返回值
                    return OriginPoemPage(poem_url_arr);
                });
            }, Promise.resolve());
        })
        .then(function(value) {
            //该朝代 所有诗信息的集合 返回值
            return value.reduce(function(sequence, value) {
                return sequence.then(function() {
                    return rp(value);
                }).then(function(body) {
                    //获取第N个朝代第N页第N条的内容
                    var $ = cheerio.load(body);
                    return poemPageAnalysis($);
                }).then(function(value) {
                    // 返回值
                    return PoemInfHan(value);
                });
            }, Promise.resolve());
        }).then(function(value) {
            if (value) {
                //生成Json
                PoemStoreJson(value);
                //下载图片
                PoetImgDown(value);
            }
        }).then(function() {
            //下一个朝代,清空前一个朝代的数据
            OriginPoemUrlAr = [];
            PoemInfAr = [];
            console.log('爬取第=================='+ i +'=======================朝代');
            //爬取下一个朝代
            getChapter(i + 1);
        }).catch(function(err) {
            console.log(err);
        });
};

getChapter(0);

//该朝代 所有诗详细信息 所在Url 集合
var OriginPoemUrlAr = [];
    //所有诗信息的 集合
var PoemInfAr = [];

function OriginPoemPage(value) {
    for (var i = 0; i < value.length; i++) {
        OriginPoemUrlAr.push(value[i]);
    }
    return OriginPoemUrlAr;
}

function PoemInfHan(value) {
    PoemInfAr.push(value);
    return PoemInfAr;
}