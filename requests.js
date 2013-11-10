var request = require('request'),
    events = require('events');

var loopId = null, 
    requestUrl = null,
    interval = 500;

function run () {
    var startTime = new Date();
    request(requestUrl, function (error, response, body) {
        var result = {
            start: +startTime,
            responseTime: new Date() - startTime,
            statusCode: response.statusCode,
            server: getServer(response)
        };
        module.exports.emit('result', result);
    });
}

function start (url) {
    stop();
    console.info('starting requests to ' + url);
    requestUrl = url;
    loopId = setInterval(run, interval);
}

function stop () {
    console.info('stopping requests');
    clearInterval(loopId);
}

function getServer (response) {
    if(response.statusCode !== 200) {
        return null;
    }

    var parsedBody = parseInt(response.body);

    if(!isNaN(parsedBody)) {
        return parsedBody;
    }


    var match = response.body.match(/CGWEBPRE(1|2)/);

    if(match && match[1]) {
        return +match[1];
    }

    return null;
}

module.exports = new events.EventEmitter();
module.exports.start = start
module.exports.stop = stop
