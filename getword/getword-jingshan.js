var http = require('http');
var divide = require('./divide1')

exports.getAndDivide = function(req, res) {
    var options = {
        host: 'www.iciba.com',
        port: 80,
        path: '/' + req.params.word
    };

    var tran_html_start = '<div class="group_pos">'
    var tran_html_end = '</div>'
    var pron_html_start = '<strong lang="EN-US" xml:lang="EN-US">'
    var pron_html_end = '</strong>'

    http.get(options, function(httpres) {
        // console.log("Got response: " + httpres.statusCode, httpres.headers);
        var buffers = [], size = 0;
        httpres.on('data', function(buffer) {
            buffers.push(buffer);
            size += buffer.length;
        });
        httpres.on('end', function() {
            var buffer = new Buffer(size), pos = 0;
            for(var i = 0, l = buffers.length; i < l; i++) {
                buffers[i].copy(buffer, pos);
                pos += buffers[i].length;
            }
            // // 'content-type': 'text/html;charset=gbk'
            // // 百度返回的页面数据流竟然还无法使用gbk完全解码。。
            // var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
            // var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);
            // console.log(buffer.toString());
            var htmlText = buffer.toString();
            var start = htmlText.indexOf(tran_html_start);
            var end = htmlText.indexOf(tran_html_end, start);
            var translation = htmlText.substring(start + tran_html_start.length, end);
            console.log("translation: " + translation);

            var pstart = htmlText.indexOf(pron_html_start);
            pstart = htmlText.indexOf(pron_html_start, pstart + pron_html_start.length);
            var pend = htmlText.indexOf(pron_html_end, pstart);
       
            var pronounce = htmlText.substring(pstart + pron_html_start.length, pend)
            console.log("pronounce: " + pronounce);
            parts = divide.divide(pronounce)
            console.log(parts);
            var dividedPronounce = parts.join("-");
            res.end(JSON.stringify({"translation": translation, "pronounce": pronounce, "dividedPronounce": dividedPronounce}));
            // for (var i = 0; i < pronounce.length; i++) {
            //     console.log(divide.isyy(pronounce[i]));
            // };
            //divide.isyy(pronounce);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}