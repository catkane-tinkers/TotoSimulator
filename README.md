# TotoSimulator
Toto Simulator

<b>Tools Used</b>

Python (for initial tests) <br>
JavaScript <br>
Regex <br>
HTML <br>
CSS <br>

<b>Understanding the Mechanics</b>

Toto is a game of probability. The winning numbers (6 + 1 additional number) are generated at random and to win, players must match 3 or more numbers.


<b>Code for Program</b>

To generate numbers, I first wrote a range function in JavaScript, which was then used to create an array with numbers from 1 − 49 (inclusive).


JavaScript's Math.random function (increasing the spread to 49) was used to pick out random numbers by index. After each pick, the number is popped from the array, to ensure the probability is fair throughout the process. The randomly picked numbers are saved in another array for comparison with the user's bet.


Regex is used to filter out the user's input. Separate bets using "[ ]," is completely unnecessary, the program can fully function even if the user keys in just a long string of digits. This is done so that users will have an easier time identifying their bets.


Comparing the user's bet and the winning numbers is just a simple if − else iteration, to save some processing power, each element is checked against the entire array, instead of one to one.


Initial processing using the setInterval function in JavaScript proved to be too slow, and using just a while loop made the entire page hang while it went through upwards of 10 million simulations. Hence, to speed up processing, while simultaneously update the screen to ensure users that the program is running, comparisons are done in batches of 12347. This is an arbituary number that I chose, but avoiding a number such as "5" as the last digit allowed the numbers to running more akin to if it is running the comparison one at a time.


<b>General Remarks</b>

The prize pool is set at a constant of 1 Million, please take it with a grain of salt. It truly is interesting to note that any arbituary numbers have an equal chance of winning (~1.8%). I also did a breakdown on the current state of Toto, do check it out if you are interested.
