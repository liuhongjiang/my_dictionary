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
    var error_note = 'class="question unfound_tips"';

    http.get(options, function(httpres) {
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

            retObj = {}

            var htmlText = buffer.toString();

            var errStart = htmlText.indexOf(error_note);
            if (errStart > 0) {
                res.end(JSON.stringify({"error": "This is not a word!"}));
                return;
            }

            var start = htmlText.indexOf(tran_html_start);
            var end = htmlText.indexOf(tran_html_end, start);

            if (start > 0) {
                var translation = htmlText.substring(start + tran_html_start.length, end);
                retObj["translation"] = translation;
            }

            var pstart = htmlText.indexOf(pron_html_start);
            pstart = htmlText.indexOf(pron_html_start, pstart + pron_html_start.length);
            var pend = htmlText.indexOf(pron_html_end, pstart);
       
            if (pstart > 0) {
                var pronounce = htmlText.substring(pstart + pron_html_start.length, pend)
                if (pronounce.indexOf(",") > 0) {
                    pronounce = pronounce.substring(0, pronounce.indexOf(","));
                }
                parts = divide.divide(pronounce);
                parts = divide.combineBY(parts);
                var dividedPronounce = parts.join("-");
                retObj["pronounce"] = "[" + pronounce + "]";
                retObj["dividedPronounce"] = dividedPronounce;
                if (req.params.word === "food") {
                    retObj["dividedSound"] = '<span><a href="javascript:;" class="ico_sound" onmouseout="clearTimeout(timer);" onmouseover="onSecondDelay(\'/sound/fu.mp3\')" onclick="asplay(\'/sound/fu.mp3\');" title="机器发音"></a></span> / <span><a href="javascript:;" class="ico_sound" onmouseout="clearTimeout(timer);" onmouseover="onSecondDelay(\'/sound/d.mp3\')" onclick="asplay(\'/sound/d.mp3\');" title="机器发音"></a></span>';
                }
            } else {
                retObj["pronounce"] = "";
                retObj["dividedPronounce"] = "";
            }
            res.end(JSON.stringify(retObj));
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}