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
var PoemDetails = require('./PoemDetail.js');
// npm依赖模块
var request = require('request');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var rp = require('request-promise');
//自定义变量
var PoemList = function(i, dynasty) {
    var poem_chain, poem_url,xixi;
    var dynasty = dynasty;
    var url = 'http://so.gushiwen.org/type.aspx?p=' + i + '&c=' + dynasty + '';
    console.log("正在获取第" + i + "页的内容");
    console.log(url);
    rp(url).then(function(body) {
        var $ = cheerio.load(body);
        var donePage = $('.typeleft > div').length;
        if (donePage !== 25) {
            return false;
        } else {
            $('.typeleft .sons').map(function(index, value) {
                console.log('ok' + index);
                if (value.children.length == 9) {
                    poem_chain = value.children[0].next.children[0].attribs.href;
                } else {
                    poem_chain = value.children[2].next.children[0].attribs.href;
                }
                poem_url = 'http://so.gushiwen.org' + poem_chain;
            });
        }
        return poem_url;
    }).then(function(poem_url){
        console.log('ok' + poem_url);
        xixi = poem_url;
    });

return xixi;

    /*    {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var donePage = $('.typeleft > div').length;
                if (donePage !== 25) {
                    return false;
                } else {
                    var poem_chain, poem_url;
                    $('.typeleft .sons').map(function(index, value) {
                        if (value.children.length == 9) {
                            poem_chain = value.children[0].next.children[0].attribs.href;
                        } else {
                            poem_chain = value.children[2].next.children[0].attribs.href;
                        }
                        poem_url = 'http://so.gushiwen.org' + poem_chain;
                    });
                    console.log(poem_chain);
                    if (i < 3) {
                        i = i + 1;
                        PoemList(i, dynasty);
                    }
                }
            }
        };*/
}

//模块导出
module.exports = PoemList;