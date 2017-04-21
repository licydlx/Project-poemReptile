 var poemPageAnalysis = function($) {
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
     /*reptileId = dynasty + '-' + sn;*/
     //诗词题目
     poemTitle = $('.son1 > h1').text().replace(/(^\s*)|(\s*$)/g, "");
     //诗人朝代
     poetDy = $('.son2 > p:nth-child(2)').text().substring($('.son2 > p:nth-child(2)').text().indexOf('：') + 1).replace(/(^\s*)|(\s*$)/g, "");
     //诗词作者
     poet = $('.son2 > p:nth-child(3)').text().substring($('.son2 > p:nth-child(3)').text().indexOf('：') + 1).replace(/(^\s*)|(\s*$)/g, "");
     //诗词原文
     poemOriginArr = $('#cont').text().replace(/(^\s*)|(\s*$)/g, "").split("");
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
         /*reptileId: reptileId,*/
         title: poemTitle,
         dynasty: poetDy,
         poet: poet,
         poem: poemPerfect,
         imgUrl: imgUrl,
         localImgName: localImgName
     };
     return poemDetail;
 }

 //模块导出
 module.exports = poemPageAnalysis;