var Requests = (function () {
    
    var socket, options = {
        chartContainerSelector: '#chart',
        columnWidth: 3,
        requestInterval: 500
    };

    function init () {
        initSocket();
        initChart();
        bindUi();
    }

    function onResult (result) {
        console.log(result);
        var chart = $(options.chartContainerSelector).highcharts();
        chart.series[0].addPoint({ 
            x: result.start, 
            y: result.responseTime, 
            color: getColor(result) 
        }, false);

        chart.yAxis[0].setExtremes(0, getYAxisMax(), false);

        var dataPoints = chart.plotWidth / options.columnWidth;
        var seconds = dataPoints * (options.requestInterval / 1000);
        chart.xAxis[0].setExtremes(Date.now() - (seconds * 1000), Date.now());
    }

    function bindUi () {
        $('#start').on('click', onStart);
        $('#stop').on('click', onStop);
    }

    function onStart (event) {
        initChart(options.chartContainerSelector);
        var url =  $('#url').val();
        socket.emit('start', url);
    }

    function onStop (event) {
        socket.emit('stop');
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

    function initChart () {
         $(options.chartContainerSelector).highcharts({
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

    function initSocket() {
        socket = io.connect(document.location.protocol + "//" + document.location.hostname);
        socket.on('disconnect', socket.socket.reconnect);
        socket.on('result', onResult);
    }

    function getYAxisMax () {
        return +$('#yMax').val() || null;
    }

    return {
        init: init
    }

})();

$(function () {
    Requests.init();
});
