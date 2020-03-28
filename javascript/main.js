let averageYield = 8.5;

let IDs = {
    "seeds": [5291, 5292, 5293, 5294, 5295, 5296, 5297, 5298, 5299, 5300, 5301, 5302, 5303, 5304],
    "clean": [249, 251, 253, 255, 257, 2998, 259, 261, 263, 3000, 265, 2481, 267, 269],
    "grimy": [199, 201, 203, 205, 207, 3049, 209, 211, 213, 3051, 215, 2485, 217, 219]
};

let prices = {};

let errorTimeout = setTimeout(alertTimeout, 10000);

fetchData(createTable);

function fetchData(callback) {
    prices = { "seeds": [], "clean": [], "grimy": [] };

    let completed = 0;
    let total = 0;

    Object.keys(IDs).forEach((which) => {
        total += IDs[which].length;

        for (let i = 0; i < IDs[which].length; i++) {
            $.getJSON(getURL(IDs[which][i]), function(data) {
                prices[which].push(data);

                completed++;

                if (completed == total) {
                    clearTimeout(errorTimeout);
                    hideLoading();
                    callback(prices);
                }
            }).error(function(data) {
                alertTimeout();
            });
        }
    })
}

function alertTimeout() {
    alert("There was an error accessing the Runelite GE values. If you are using an extension to block external requests, please allow \"api.runelite.com\".\n\nIf you keep receiving this error, please contact my developer.");
}

function hideLoading() {
    document.querySelector("#spinner").style.display = "none";
}

function createTable(prices) {
    let table = document.querySelector("#data");
    let largestVal = 0;

    //i was tired and couldn't figure out a better way to do this. sorry
    for (let i = 0; i < IDs.seeds.length; i++) {
        cName = prices.getValue("clean", IDs.clean[i]).name;
        sAvg = prices.getValue("seeds", IDs.seeds[i]).price;
        gAvg = prices.getValue("grimy", IDs.grimy[i]).price;
        grossValue = Math.trunc((gAvg * averageYield) - sAvg);

        if (grossValue > largestVal) {
            largestVal = grossValue;
        }

        grossValue < 0 ? color = "red" : color = "green";

        let row =
            `<tr class='row' data-value='${ grossValue }'>
                <td class='hcname'><b>${cName.toLocaleString()}</b></td>
                <td class='savg'>${sAvg.toLocaleString()}</td>
                <td class='gavg'>${gAvg.toLocaleString()}</td>
                <td class='total ${ color }'>${grossValue.toLocaleString()}</td>
            </tr>`;

        table.querySelector("tbody").innerHTML += row;
    };

    document.querySelector(`.row[data-value='${largestVal}']`).className = "row highest";

    new Tablesort(table);
}

function getURL(itemID) {
    return `https://api.runelite.net/runelite-1.6.10/item/${itemID}/price`;
    //runelite API actually lets you grab the data directly. allorigins is legacy
    //return `https://api.allorigins.win/get?url=${encodeURIComponent(request)}&callback=?`
}

Object.prototype.getValue = function(which, id) {
    for (let i = 0; i < this[which].length; i++) {
        if (this[which][i].id == id) return this[which][i]
    }
    return undefined;
}

window.onload = function() {
    document.querySelector("#avgherbs").addEventListener("input", e => {
        averageYield = e.target.value;

        document.querySelector("tbody").innerHTML = "";
        createTable(prices);
    });
}