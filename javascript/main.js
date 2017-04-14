var averageYield = 6;
var relevantIDs = {
    "count": 14,
    "seeds": [5291, 5292, 5293, 5294, 5295, 5296, 5297, 5298, 5299, 5300, 5301, 5302, 5303, 5304],
    "herbs_clean": [249, 251, 253, 255, 257, 2998, 259, 261, 263, 3000, 265, 2481, 267, 269],
    "herbs_grimy": [199, 201, 203, 205, 207, 3049, 209, 211, 213, 3051, 215, 2485, 217, 219]
};

var url = "https://rsbuddy.com/exchange/summary.json";
var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='") + url + "'&format=json";

$.getJSON(yql, function(data) {
    parseJSON(JSON.parse(data.query.results.body));
}).error(function(data) {
    alert("There was an error accessing the OSBuddy GE values");
});

function parseJSON(data) {
    var table = document.querySelector("#data");
    var largestVal = 0;

    for (i = 0; i < relevantIDs.count; i++) {
        var sID = relevantIDs.seeds[i];
        var hcID = relevantIDs.herbs_clean[i];
        var hgID = relevantIDs.herbs_grimy[i];

        var hcName = data[hcID].name;

        var sAvg = data[sID].buy_average;
        var hgAvg = data[hgID].sell_average;
        var hcAvg = data[hcID].sell_average;

        var hgNetProfit = (data[hgID].sell_average * averageYield);
        var hcNetProfit = (data[hcID].sell_average * averageYield);

        if (hgNetProfit > largestVal) {
            largestVal = hgNetProfit;
        }

        var row =
            "<tr>" +
            "<td  class='hcname'><b>" + hcName + "</b></td>" +
            "<td class='savg'>" + format(sAvg) + "</td>" +
            "<td class='hgavg'>" + format(hgAvg) + "</td>" +
            "<td class='hgprofit'>" + format(hgNetProfit) + "</td>" +
            "<td class='hcprofit'>" + format(hcNetProfit) + "</td>" +
            "</tr>";

        table.querySelector("tbody").innerHTML += row;
    }

    var profits = document.querySelectorAll(".hgprofit");
    for (var i = 0; i < profits.length; i++) {
        if (profits[i].innerHTML == format(largestVal)) {
            console.log(profits[i].setAttribute("class", "hgprofit largest"));
        }
    }

    new Tablesort(table);
}

function format(number) {
    return number.toLocaleString();
}
