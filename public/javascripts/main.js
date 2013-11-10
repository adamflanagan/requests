var Requests = (function () {
    
    var options = {
        chartContainerSelector: '#chart',
        columnWidth: 3,
        requestInterval: 500
    };

    var socket = io.connect(document.location.protocol + "//" + document.location.hostname);
    socket.on('disconnect', function() {
        socket.socket.reconnect();
    });

    function init () {

        initChart(options.chartContainerSelector);
        bindUi();

        socket.on('result', function (result) {
            console.log(result);
            var chart = $(options.chartContainerSelector).highcharts();
            chart.series[0].addPoint({ 
                x: result.start, 
                y: result.responseTime, 
                color: getColor(result) 
            }, false);

            var dataPoints = chart.plotWidth / options.columnWidth;
            var seconds = dataPoints * (options.requestInterval / 1000);
            chart.xAxis[0].setExtremes(Date.now() - (seconds * 1000), Date.now());
        });
    }

    function bindUi () {
        $('#start').on('click', function (event) {
            initChart(options.chartContainerSelector);
            var url =  $('#url').val();
            socket.emit('start', url);
        });

        $('#stop').on('click', function (event) {
            socket.emit('stop');
        });
    }

    function getColor (result) {
        if(result.statusCode !== 200) {
            return 'red';
        }
        else if(result.server === 1) {
            return 'blue';
        }
        else {
            return 'green';
        }
    }

    function initChart (selector) {
         $(selector).highcharts({
            chart: {
                type: 'column',
                animation: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Response Time (ms)'
                }
            },
            scrollbar: {
                enabled: true
            },
            plotOptions: {
                series: {
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 0, 
                    shadow: false,
                    pointWidth: options.columnWidth
                }
            },
            series:[{
                data: []
            }],
            credits: {
                enabled: false
            }
        });
    }

    return {
        init: init
    }

})();

$(function () {
    Requests.init();
});
