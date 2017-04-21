//依赖模块
var fs = require('fs');

//生成Json
var PoemStoreJson = function(value) {
    var outputFilename = './json/' + value[0].dynasty + '.json';
    console.log('==========================');
    console.log(outputFilename);
    if (value) {
        fs.writeFile(outputFilename, JSON.stringify(value, null, 2), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFilename);
            }
        });
    }
}

//模块导出
module.exports = PoemStoreJson;