function range(a, b) {
    var rangeList = [];
    if (!b) {
        for (var run = 0; run < a; run++) {
            rangeList.push(run);
        }
    } else {
        while (a < b) {
            rangeList.push(a);
            a++;
        }
    } return rangeList;
}
var numberPool = range(1, 50);
var prizeGroup = [0,0,0,0,0,0,0];
var frequencyCounter = {};
var runs = 0;
var playerBet = [];
var criteria;
var interval;

function generateNumber(fromHere, system) {
    var chosenNumbers = [];
    var functioningPool = fromHere.slice(0);
    while (chosenNumbers.length != 6) {
        var chosen = functioningPool[Math.floor(Math.random() * functioningPool.length)];
        chosenNumbers.push(chosen);
        functioningPool.splice(functioningPool.indexOf(chosen), 1);
    }
    chosenNumbers = chosenNumbers.sort(function(a, b) {
                        return a - b;
                    });
    if (system) {
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
    return chosenNumbers;
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
    if (counter == 6) {prizeGroup[0] += 1}
    else if (counter == 5) {
        if (additionalCounter) {prizeGroup[1] += 1}
        else {prizeGroup[2] += 1}
    } 
    else if (counter == 4) {
        if (additionalCounter) {prizeGroup[3] += 1}
        else (prizeGroup[4] += 1);
    }
    else if (counter == 3) {
        if (additionalCounter) {prizeGroup[5] += 1}
        else {prizeGroup[6] += 1}
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
    for (var run = 0; run < 6; run++) {
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


function toggleDisabled(checked) {
    var cycles = document.getElementById('Cycles');
    cycles.disabled = checked ? true : false;
    cycles.placeholder = checked ? 'Not Applicable' : 'Number of Simulations';
    cycles.value = checked ? 'Not Applicable' : '';
}


function toggleButton() {
    var Start = document.getElementById('Start');
    var ongoing = Start.value == 'Start!' ? false : true;
    if (ongoing) {
        clearInterval(interval);
        Start.value = 'Start!'}
    else {
        Start.value = getInput() ? 'Stop!' : 'Start!';
        
    }
}
    

function checkUserInput(string) {
    var run = 0;
    var bet = [];
    var pass = true;
    if (!string || string.length % 6 !== 0) {
        pass = false;
        printOnScreen('Make sure you keyed in 6 numbers per bet.')}
    else if (Math.max(...string) > 49 || Math.min(...string) < 1) {
        pass = false;
        printOnScreen('Make sure your numbers are between 1 and 49.')}
    else {
        var numbers = [];
        string.forEach(element => {
            if (numbers.includes(element)) {
                printOnScreen('Make sure you did not key in duplicate numbers.');
                pass = false;
            } else {numbers.push(element)}
            numbers = [];
            run += 1;
            bet.push(element);
            if (run == 6) {
                playerBet.forEach(element => {
                    if (JSON.stringify(bet) == JSON.stringify(element)) {
                        printOnScreen('Make sure you did not key in duplicate bets.')
                        pass = false;}
                });
            playerBet.push(bet);
            run = 0;
            bet = [];
            }})
        }
    return pass
}

function getInput() {
    var regex = /(\d+)/g;
    var userInputs = document.getElementById('Bet').value;
    var checked = document.getElementById('Jackpot').checked;

    // resets
    prizeGroup = [0,0,0,0,0,0,0];
    runs = 0;
    playerBet = [];
    criteria;
    interval;

    if (checkUserInput(userInputs.match(regex))) {
        if (checked) {criteria = 'Jackpot'} else {
            var cycles = document.getElementById('Cycles').value;
            cycles = cycles.match(regex);
        if (!cycles || cycles.length != 1) {
            printOnScreen('Key in a single number for "Number of Simulations"')
            return false;
        } else {criteria = Number(cycles)}
        } 
    }
    if (playerBet && criteria) {
        interval = setInterval(loop, 1);
        return true}
}

function loop() {
    if (criteria == "Jackpot" || criteria > 399) {
        for (var miniruns = 0; miniruns < 12347; miniruns++) {
            runs += 1;
            playerBet.forEach(element => {
                compare(element, generateNumber(numberPool, 'system'))
            })
            if (prizeGroup[0] == 1 || runs == criteria) {break}
        }
    } else {
        runs += 1;
        playerBet.forEach(element => {
            compare(element, generateNumber(numberPool, 'system'))
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
    context.fillStyle = "#000000";
    context.textAlign = "center";
    context.font = "25px Arial";

    // Cost Analysis
    var PNL = (prizeGroup[0] * 1000000 + prizeGroup[1] * 80000 + prizeGroup[2] * 55000 + 
        prizeGroup[3] * 30000 + prizeGroup[4] * 50 + prizeGroup[5] * 25 + prizeGroup[6] * 10) - (runs * playerBet.length)

    context.fillText('You made: '.concat(PNL).concat(' in total!'), 175, canvas_height * 0.15);

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
        context.fillText('Win % per Draw: ', 250, canvas_height * 0.6)
        context.fillText(winningPercentage()[1], 250, canvas_height * 0.65)

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