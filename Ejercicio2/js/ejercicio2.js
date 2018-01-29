/*********************************/
/* Prueba de Codigo - Ejercicio2 */
/* Autor: Jorge Garcia Iglesias  */
/*********************************/

// Constants
const oneDay = 24 * 3600 * 1000;
const baseUrl = "http://s3.amazonaws.com/logtrust-static/test/test/";

// Global variables
var data1 = []
var data2 = []
var total = 0.0;

var totals = new Map();       // Map: Category -> Totals
var categories = new Map();   // Map: Category -> Map: Date -> Totals

var startDate = Date.UTC(2999, 0, 1);
var endDate = Date.UTC(1970, 0, 1);

/************/
/*  Serie1  */
/************/
function processSerie1(values) {
    for(var i = 0; i < values.length; i++) {
        var obj1 = values[i];
        processEvent(1, obj1.d, obj1.cat, obj1.value);
    }
    
    loadSerie("data2.json", processSerie2)
}

/************/
/*  Serie2  */
/************/
function processSerie2(values) {
    for(var i = 0; i < values.length; i++) {
        var obj2 = values[i];
        var myDate = obj2.myDate.split("-");
        myDate = new Date(myDate[0], myDate[1]-1, myDate[2]);
        var myTime = myDate.getTime() - myDate.getTimezoneOffset() * 60 * 1000;
        processEvent(2, myTime, obj2.categ, obj2.val);
    }
    
    loadSerie("data3.json", processSerie3)
}

/************/
/*  Serie3  */
/************/
function processSerie3(values) {
    for(var i = 0; i < values.length; i++) {
        var obj3 = values[i];
        var raw = parseRaw(obj3.raw);
        var myDate = raw.date.split("-");
        myDate = new Date(myDate[0], myDate[1]-1, myDate[2]);
        var myTime = myDate.getTime() - myDate.getTimezoneOffset() * 60 * 1000;
        processEvent(3, myTime, raw.cat, obj3.val);
    }
    
    loadCharts();
}

function parseRaw(raw) {
    var date = null;
    var category = null;
    var value = "";
    var insideCategory = false;
    for(var i = 0; i < raw.length; i++) {
        c = raw.charAt(i);
        if(c == ' ') {
            if(insideCategory) {
                value = value + c;
            } else {
                if(date == null && isDate(value)) {
                    date = value;
                }
                value = "";
            }
        } else if(!insideCategory) {
            if(value == "" && c == '#') {
                insideCategory = true;
            } else if(c != '#') {
                value = value + c;
            }
        } else if(c != '#') {
            value = value + c;
        } else {
            insideCategory = false;
            value = value.toUpperCase();
            if(category == null) {
                category = value;
            }
        }
    }
    if(value != null && value.length > 0) {
        if(date == null && isDate(value)) {
            date = value;
        }
    }
    return JSON.parse('{"date": "' + date + '","cat": "' + category + '"}');
}

/********************/
/* Common functions */
/********************/
function loadSerie(name, callback) {
    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl + name;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var values = JSON.parse(this.responseText);
            callback(values);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function processEvent(id, time, cat, value) {
    cat = cat.toUpperCase();
    //console.log("Processing event: " + id + ";" + new Date(time).toJSON().substring(0, 10) + ";" + time + ";" + cat + ";" + value.toString().replace('.', ','));
    
    // Totals Pie chart
    var val = totals.get(cat);
    if(val == null) {
        val = 0.0;
    }
    totals.set(cat, val + value);
    total += value;
    
    // Line Chart
    category = categories.get(cat);
    if(category == null) {
        category = new Map();
        categories.set(cat, category);
    }
    
    var entry = category.get(time);
    if(entry == null) {
        entry = 0.0;
    }
    category.set(time, entry + value);
    
    // Start Date
    if(startDate > time) {
        startDate = time;
    }
    if(endDate < time) {
        endDate = time;
    }
}

function isDate(value) {
    var regExp = /^(\d{4})(\-)(0[1-9]|1[012])(\-)(0[1-9]|[1-2]\d|3[01])$/;
    return regExp.test(value);
}

/***********************/
/* Aggregate functions */
/***********************/
function loadCategories() {
    data1 = [];
    categories.forEach(addCategory);
}

function addCategory(value, key, map) {
    var values = [];
    for(var time = startDate; time <= endDate; time += oneDay) {
        var entry = value.get(time);
        if(entry == null) {
            entry = 0.0;
        }
        values.push(entry);
    }
    data1.push({ name: key, data: values });
}

function loadTotals() {
    data2 = [];
    totals.forEach(addTotals);
}

function addTotals(value, key, map) {
    var percentaje = (value / total) * 100;
    data2.push({ name: key, y: percentaje });
}

function loadCharts() {
    // Load data for Line Chart
    loadCategories();
    
    // Load data for PieChart
    loadTotals();
    
    totals.clear();
    categories.clear();
    
    // Init Line Chart
    Highcharts.chart('container1', {
        title: {
            text: 'Test - Line chart'
        },
        subtitle: {
            text: 'Source: ' + baseUrl
        },
        xAxis: {
             type: 'datetime',
             dateTimeLabelFormats: {
                 day: '%e. %b'
             }
        },
        yAxis: {
            title: {
                text: 'Totales'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: startDate,
                pointInterval: oneDay // one day
            }
        },
        series: data1,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
    
    // Init Pie Chart
    Highcharts.chart('container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Test - Pie Chart'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Porcentaje',
            colorByPoint: true,
            data: data2
        }]
    });
}

/*****************/
/* Main function */
/*****************/
function loadData() {
    // Start loading Serie1
    loadSerie("data1.json", processSerie1);
}

loadData();
