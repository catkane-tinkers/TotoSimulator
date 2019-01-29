function range(a, b) {
    var rangeList = [];
    if (!b) {
        for (var minirun = 0; minirun < a; minirun++) {
            rangeList.push(minirun);
        }
    } else {
        while (a < b) {
            rangeList.push(a);
            a++;
        }
    } return rangeList;
}


var prizeGroup = [0,0,0,0,0,0,0];
var frequencyCounter = {};
var runs = 0;
var playerBet = [];
var criteria;
var interval;
var profit = 0;
var limit;

var group1_winnings;
var group2_winnings;
var group3_winnings;
var group4_winnings;


// Prizepool Calculations

var group1 = {100: 27.84091, 200: 29.54545, 300: 1.13636, 400: 20.45455, 500: 1.70455, 600: 1.13636, 700: 6.81818, 800: 5.68182, 900: 2.84091, 1000: 0.56818, 1100: 2.27273};
var group2 = {20: 51.20773, 30: 14.25121, 40: 14.7343, 50: 5.55556, 60: 2.41546, 70: 4.83092, 80: 1.20773, 90: 1.44928};
var group3 = {10: 5.12249, 15: 44.98886, 20: 21.15813, 25: 10.46771, 30: 6.90423, 35: 1.78174, 40: 0.89087, 45: 2.44989, 50: 2.44989, 60: 1.55902, 65: 2.22717};
var group4 = {6: 1.55902, 8: 40.3118, 10: 24.27617, 12: 5.34521, 14: 8.24053, 16: 8.01782, 18: 1.78174, 20: 0.89087, 22: 0.22272, 24: 2.00445, 26: 7.34967};


function prizepool(pool_dict) {
    // Populates probable prizepool values according to distributions
    var probabilities = []
    for (key in pool_dict) {
        for (var i = 0; i < pool_dict[key]; i++) {
            probabilities.push(key)
        }
    }
    // Gets minimum of prizepool (10000 because of 1 unit is 10000. personal choice for ease of calculation)
    var minimum = probabilities[Math.floor(Math.random() * probabilities.length)] * 10000

    // Gets respective prizepool's step i.e group1 = 100, group2 = 10
    var step;
    if (pool_dict == group1) {step = 100}
    else if (pool_dict == group2) {step = 10}
    else if (pool_dict == group3) {step = 5}
    else if (pool_dict == group4) {step = 2}

    // Simulates prizepool by getting a value between minimum prizepool value and maximum (prizepool + step * 10000)
    return Math.floor(Math.random() * (10000*step)) + minimum
}


// Shared Winners Calculations

var group1_winners = {1: 68.18182, 2: 23.29545, 3: 2.84091, 4: 3.97727, 5: 1.70455};
var group2_winners = {1: 19.32367, 2: 22.46377, 3: 16.66667, 4: 12.07729, 5: 8.9372, 6: 6.03865, 7: 2.657, 8: 4.34783, 9: 2.17391, 10: 0.96618, 11: 4.34783};
var group3_winners = {40: 2.22717, 60: 14.47661, 80: 20.04454, 100: 16.03563, 120: 8.24053, 140: 8.90869, 160: 6.23608, 180: 3.11804, 200: 6.01336, 220: 2.22717, 240: 12.47216};
var group4_winners = {100: 13.58575, 200: 35.63474, 300: 22.049, 400: 10.02227, 500: 6.23608, 600: 3.34076, 700: 2.89532, 800: 2.44989, 900: 1.3363, 1000: 1.11359, 1100: 1.3363};


function sharedwinners(winners_dict) {
    // Populates probable number of winners according to distributions
    var probabilities = []
    for (key in winners_dict) {
        for (var i = 0; i < winners_dict[key]; i++) {
            probabilities.push(key)
        }
    }
    // Gets minimum of shared winners
    var minimum = Number(probabilities[Math.floor(Math.random() * probabilities.length)])

    // Gets respective winners_dict's step i.e group1 = 1, group2 = 1
    var step;
    if (winners_dict == group1_winners) {step = 1;}
    else if (winners_dict == group2_winners) {step = 1;}
    else if (winners_dict == group3_winners) {step = 20;}
    else if (winners_dict == group4_winners) {step = 100;}

    // Simulates shared_winners by getting a value between minimum number of winners and maximum (minimum + step)
    return Math.floor(Math.random() * step) + minimum
}


// Calculate Winnings

function winnings(group) {
    var winnings;
    if (group == 1) {
        winnings = prizepool(group1) / sharedwinners(group1_winners);
    } else if (group == 2) {
        winnings = prizepool(group2) / sharedwinners(group2_winners);
    } else if (group == 3) {
        winnings = prizepool(group3) / sharedwinners(group3_winners);
    } else if (group == 4) {
        winnings = prizepool(group4) / sharedwinners(group4_winners);
    }

    return Math.round(winnings)
}


function generateNumber(betLength, fromHere) {
    if (betLength == 'winningNumbers') {
        var chosenNumbers = [];
        var functioningPool = range(1, 50);
        while (chosenNumbers.length != 6) {
            var chosen = functioningPool[Math.floor(Math.random() * functioningPool.length)];
            chosenNumbers.push(chosen);
            functioningPool.splice(functioningPool.indexOf(chosen), 1);
        }
        chosenNumbers = chosenNumbers.sort(function(a, b) {
                            return a - b;
                        });
        chosenNumbers.forEach(element => {
            if (frequencyCounter[element]) {
                frequencyCounter[element] += 1;
            } else {frequencyCounter[element] = 1}
        });
        var additionalNumber = functioningPool[Math.floor(Math.random() * functioningPool.length)];
        if (frequencyCounter[additionalNumber]) {
            frequencyCounter[additionalNumber] += 1;
        } else {frequencyCounter[additionalNumber] = 1}
        return [chosenNumbers, additionalNumber];
    }
    else {
        var chosenNumbers = []
        for (var lvl1 = 0; lvl1 < fromHere.length; lvl1++) {
            var shortened1 = fromHere.slice(lvl1 + 1) 
            for (var lvl2 = 0; lvl2 < shortened1.length; lvl2++) {
                var shortened2 = shortened1.slice(lvl2 + 1) 
                for (var lvl3 = 0; lvl3 < shortened2.length; lvl3++) {
                    var shortened3 = shortened2.slice(lvl3 + 1) 
                    for (var lvl4 = 0; lvl4 < shortened3.length; lvl4++) {
                        var shortened4 = shortened3.slice(lvl4 + 1) 
                        for (var lvl5 = 0; lvl5 < shortened4.length; lvl5++) {
                            var shortened5 = shortened4.slice(lvl5 + 1) 
                            for (var lvl6 = 0; lvl6 < shortened5.length; lvl6++) {
                                chosenNumbers.push([fromHere[lvl1], shortened1[lvl2], shortened2[lvl3], shortened3[lvl4], shortened4[lvl5], shortened5[lvl6]])
                            }
                        }
                    }
                }
            }
        }
        return chosenNumbers
    }
}


function compare(userInputs, winningNumbers) {
    var counter = 0;
    var additionalCounter = 0;

    userInputs.forEach(element => {
        if (winningNumbers[0].includes(Number(element))) {
            counter += 1;
        } else if (winningNumbers[1] == Number(element)) {
            additionalCounter += 1;
        }
    }); 
    if (counter == 6) {
        prizeGroup[0] += 1;
        profit += group1_winnings;
    }
    else if (counter == 5) {
        if (additionalCounter) {
            prizeGroup[1] += 1;
            profit += group2_winnings;
        }
        else {
            prizeGroup[2] += 1;
            profit += group3_winnings;
        }
    } 
    else if (counter == 4) {
        if (additionalCounter) {
            prizeGroup[3] += 1;
            profit += group4_winnings;
        }
        else {
            prizeGroup[4] += 1;
            profit += 50;
        }
    }
    else if (counter == 3) {
        if (additionalCounter) {
            prizeGroup[5] += 1;
            profit += 25;
        }
        else {
            prizeGroup[6] += 1;
            profit += 10;
        }
    }
}


function winningPercentage() {
    var numberOfWins = 0;
    prizeGroup.forEach(element => {
        numberOfWins += element;
    });

    var winningPercentagePerDraw = numberOfWins/runs * 100;
    var winningPercentagePerBet = numberOfWins/runs/playerBet.length * 100;

    return [winningPercentagePerBet.toPrecision(5), winningPercentagePerDraw.toPrecision(5)];
}


function mostFrequentNumbers() {
    var topSix = [];
    for (var minirun = 0; minirun < 6; minirun++) {
        var currentHighest = [0, 0];
        for (var key in frequencyCounter) {
            if (frequencyCounter[key] > currentHighest[0]) {
                currentHighest = [frequencyCounter[key], key];
            }
        }
        topSix.push(currentHighest);
        frequencyCounter[currentHighest[1]] = 0;
    }
    return [topSix[0][1], topSix[1][1], topSix[2][1], topSix[3][1], topSix[4][1], topSix[5][1]];
}


function toggleDisabled(checked, pointer) {
    if (pointer == 1) {
        var cycles = document.getElementById('Cycles');
        cycles.disabled = checked ? true : false;
        cycles.placeholder = checked ? 'Not Applicable' : 'Number of Simulations';
        cycles.value = checked ? 'Not Applicable' : '';
    }
    else {
        var betLength = document.getElementById('betLength');
        betLength.disabled = checked ? false : true;
        betLength.placeholder = checked ? 'Type' : 'Not Applicable';
        betLength.value = checked ? '' : 'Not Applicable';
    }
}


function toggleButton() {
    var Start = document.getElementById('Start');
    var ongoing = Start.value == 'Start!' ? false : true;
    if (ongoing) {
        clearInterval(interval);
        Start.value = 'Start!'
    }
    else {
        // resets
        prizeGroup = [0,0,0,0,0,0,0];
        frequencyCounter = {};
        runs = 0;
        playerBet = [];
        criteria;
        interval;
        profit = 0;

        Start.value = getInput() ? 'Stop!' : 'Start!';
    }
}
    

function checkUserInput(string, betLength) {
    var minirun = 0;
    var bet = [];
    var pass = true;
    if (betLength > 12 || betLength < 6) {
        pass = false;
        printOnScreen('System Bets only go from 7 - 12.')
    }
    else if (!string || string.length % betLength != 0) {
        pass = false;
        printOnScreen('Make sure you keyed in '.concat(betLength).concat(' numbers per bet.'))}
    else if (Math.max(...string) > 49 || Math.min(...string) < 1) {
        pass = false;
        printOnScreen('Make sure your numbers are between 1 and 49.')}
    else {
        var numbers = [];
        string.forEach(element => {
            if (numbers.includes(element)) {
                printOnScreen('Make sure you did not key in duplicate numbers.');
                pass = false;
                return pass
            } else {numbers.push(element)}
            minirun += 1;
            bet.push(element);
            if (minirun == betLength) {
                playerBet.forEach(element => {
                    if (JSON.stringify(bet) == JSON.stringify(element)) {
                        printOnScreen('Make sure you did not key in duplicate bets.')
                        pass = false;}
                });
            if (betLength != 6) {
                generateNumber('yes', bet).forEach(element => playerBet.push(element))
            } else {playerBet.push(bet)}
            minirun = 0;
            bet = [];
            numbers = [];
            }})
        }
    limit = Math.min(3237, 17450/playerBet.length)
    return pass
}


function getInput() {
    var regex = /(\d+)/g;
    var userInputs = document.getElementById('Bet').value;
    var checked = document.getElementById('Jackpot').checked;
    var betLength = document.getElementById('betLength').value;

    if (!betLength || betLength == 'Not Applicable') {
        betLength = 6;
    }

    if (checkUserInput(userInputs.match(regex), betLength)) {
        if (checked) {criteria = 'Jackpot'} else {
            var cycles = document.getElementById('Cycles').value;
            cycles = cycles.match(regex);
        if (!cycles || cycles.length != 1) {
            printOnScreen('Key in a single number for "Number of Simulations"')
            return false;
        } else {criteria = Number(cycles)}
        }
    }

    if (playerBet.length != 0 && criteria) {
        interval = setInterval(loop, 1);
        return true}
}


function new_run() {
    runs += 1;
    group1_winnings = winnings(1)
    group2_winnings = winnings(2)
    group3_winnings = winnings(3)
    group4_winnings = winnings(4)
}


function loop() {
    if (criteria == "Jackpot" || criteria > 399) {
        for (var miniruns = 0; miniruns < limit; miniruns++) {
            new_run();
            playerBet.forEach(element => {
                compare(element, generateNumber('winningNumbers'))
            })
            if (prizeGroup[0] == 1 || runs == criteria) {break}
        }
    } else {
        new_run();
        playerBet.forEach(element => {
            compare(element, generateNumber('winningNumbers'))
        })
    };
    updateResults();
    if ((criteria == "Jackpot" && prizeGroup[0] == 1) || runs == criteria) {
        toggleButton();
        updateResults('final');
    }
}



// Drawing Kit

var canvas = document.getElementById("Results");
var context = canvas.getContext('2d');

var canvas_width = canvas.clientWidth;
var canvas_height = canvas.clientHeight;

function updateResults(string) {
    context.beginPath();
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.textAlign = "center";
    context.font = "25px Arial";

    // Cost Analysis
    var cost = runs * playerBet.length
    var PNL = profit - cost;

    if (PNL > 0) {
        context.fillStyle = "#00ff00";
        context.fillText('Profit: $'.concat(PNL), 175, canvas_height * 0.15);
    } else {
        context.fillStyle = "#ff0000";
        context.fillText('Loss: $'.concat(Math.abs(PNL)), 175, canvas_height * 0.15);
    }

    context.fillStyle = "#000000";
    context.font = "15px Arial";

    context.fillText('Group 1: ', 50, canvas_height * 0.28);
    context.fillText('Group 2: ', 50, canvas_height * 0.38);
    context.fillText('Group 3: ', 50, canvas_height * 0.48);
    context.fillText('Group 4: ', 50, canvas_height * 0.58);
    context.fillText('Group 5: ', 50, canvas_height * 0.68);
    context.fillText('Group 6: ', 50, canvas_height * 0.78);
    context.fillText('Group 7: ', 50, canvas_height * 0.88);

    context.fillText(prizeGroup[0], 120, canvas_height * 0.28);
    context.fillText(prizeGroup[1], 120, canvas_height * 0.38);
    context.fillText(prizeGroup[2], 120, canvas_height * 0.48);
    context.fillText(prizeGroup[3], 120, canvas_height * 0.58);
    context.fillText(prizeGroup[4], 120, canvas_height * 0.68);
    context.fillText(prizeGroup[5], 120, canvas_height * 0.78);
    context.fillText(prizeGroup[6], 120, canvas_height * 0.88);

    context.fillText('Simulations Ran: ', 250, canvas_height * 0.75);
    context.fillText(runs, 250, canvas_height * 0.80);

    if (string == 'final') {
    
        context.fillText('Number of Years: ', 250, canvas_height * 0.85);
        context.fillText(Math.round(runs / 104), 250, canvas_height * 0.90);

        context.fillText('Most Frequent Numbers: ', 250, canvas_height * 0.3);
        context.fillText(mostFrequentNumbers(), 250, canvas_height * 0.35);
        context.fillText('Win % per Bet: ', 250, canvas_height * 0.45)
        context.fillText(winningPercentage()[0], 250, canvas_height * 0.5)
        context.fillText('Profit per Draw: ', 250, canvas_height * 0.6)
        context.fillText('$'.concat(Math.round(PNL/runs)), 250, canvas_height * 0.65)

    if (criteria == 'Jackpot') {
        context.fillText('Chance of getting Jackpot: 1/'.concat(runs), canvas_width/2, canvas_height * 0.98)
    }
    }
}

function printOnScreen(string) {
    context.beginPath();
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.fillStyle = "#000000";
    context.textAlign = "center";
    context.font = "15px Arial";
    context.fillText('Key in your bets below, separated by "[ ],"', canvas_width/2, canvas_height/4);
    context.fillText('e.g [1,2,3,4,5,6], [3,4,5,6,7,8]', canvas_width/2, canvas_height/3.3);
    context.fillText('Key in the number of simulations you want to run.', canvas_width/2, canvas_height/2.6);
    context.fillText('1 simulation = 1 draw.', canvas_width/2, canvas_height/2.3);
    context.fillText('Click Start! when ready.', canvas_width/2, canvas_height * 0.9);

    if (string) {
        context.fillStyle = "#ff0000";
        context.fillText(string, canvas_width/2, canvas_height/1.5);
    }
}

printOnScreen();
