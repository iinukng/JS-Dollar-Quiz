// Var linked to html
let timeCount = document.querySelector('#time-count');
let container = document.querySelector('#container');
let title = document.querySelector('#title');
let textBox = document.querySelector('#text-box');
let startBtn = document.querySelector('#start-btn');
let answers = document.querySelector('#answers');

// question structure
class Question {
    constructor(question, options, answers) {
        this.question = question;
        this.options = options;
        this.answers = answers;
    }
}

// question array
let questions = [];

const option1 = ['Denzel Washington', 'Kerry Washington', 'John David Washington', 'George Washington'];
const question1 = new Question('Who is on the one dollar bill?', option1, 'George Washington');
questions.push(question1);

const option2 = ['Andrew Lincoln', 'Abraham Lincoln', 'Robert E. Lee', 'Stonewall Jackson'];
const question2 = new Question('Who is on the five dollar bill?', option2, 'Abraham Lincoln');
questions.push(question2);

const option3 = ['Alexander Hamilton', 'Linda Hamilton', 'Nicolas Hamilton', 'George Hamilton'];
const question3 = new Question('Who is on the ten dollar bill?', option3, 'Alexander Hamilton');
questions.push(question3);

const option4 = ['Lamar Jackson', 'Micheal Jackson', 'Janet Jackson', 'Andrew Jackson'];
const question4 = new Question('Who is on the twenty dollar bill?', option4, 'Andrew Jackson');
questions.push(question4);

const option5 = ['Ulysses S. Grant', 'Stonewall Jackson', 'Abraham Lincoln', 'Robert E. Lee'];
const question5 = new Question('Who is on the fifty dollar bill?', option5, 'Ulysses S. Grant');
questions.push(question5);

const option6 = ['Samuel Adams', 'Benjamin Franklin', 'Thomas Jefferson', 'James Madison'];
const question6 = new Question('Who is on the one hundred dollar bill?', option6, 'Benjamin Franklin');
questions.push(question6);

let optList = [];
let curQstn = 0;
let score = 0;
let timeLeft = 31;
let ongoing = false;
let ldrbrd = [];
let initials = '';
let clearing = false;
let refresh = 0;
let correct = false;

// turn start into a button
function init() {
    startBtn.addEventListener('click', questionLoop);
    // scores.addEventListener('click', showScores);
}

// starts the quiz 
function questionLoop () {
    runTimer();
    ongoing = true;
    startBtn.setAttribute('style', 'display: none');
    textBox.setAttribute('style', 'display: none');
    let numOfOptions = questions[0].options.length;
    for(let i = 0; i < numOfOptions; i++) {
        let option = document.createElement('button');
        container.appendChild(option);
        optList.push(option);
        option.setAttribute('id', `button${i + 1}`);
    }
    nextQuestion();
}

// timer
function runTimer () {
    let clock = setInterval(function() {
        timeLeft--;
        timeCount.textContent = `Time: ${timeLeft} seconds`;
        if(timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== 'Finished') {
                endOfQuiz();
            }
        }
    }, 1000)
}

// question swappers
function nextQuestion(event) {
    writeAnswer(event);
    if(curQstn < questions.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}

// checks if the answer is right
function writeAnswer(event) {
    if(event !== undefined) {
        if(event.currentTarget.textContent === questions[curQstn - 1].answers) {
            correct = true;
            score += 20;
        } else {
            correct = false;
            if(timeLeft > 5) {
                timeLeft -= 5;
            } else {
                timeLeft = 1;
            }
            timeCount.setAttribute('style', 'color: red');
            setTimeout(function () {
                timeCount.setAttribute('style', 'color: black');
            } ,1000);
        }
        clearAnswer();
    }
}

// restarts quiz
function clearAnswer() {
    if(clearing) {
        clearing = false;
        clearTimeout(refresh);
        clearAnswer();
    } else {
        clearing = true;
        refresh = setTimeout(function() {
            answers.textContent = '';
            clearing = false;
        }, 3000);
    }
}

// changes the questions
function changeQuestion() {
    title.textContent = questions[curQstn].question;
    for(let i = 0; i < questions[curQstn].options.length; i++) {
        optList[i].textContent = questions[curQstn].options[i];        
        optList[i].addEventListener('click', nextQuestion);
    }
    curQstn++;
}

// shows the results
function endOfQuiz() {
    title.textContent = 'Finished';
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    textBox.textContent = `Your final score is ${score}`;
    inputFields();
}

// clears the quiz 
function clearOptions() {
    for(let i = 0; i < optList.length; i++) {
        optList[i].remove();
    }
    optList = [];
}

// initials form
function inputFields() {
    let initialsForm = document.createElement('form');
    container.appendChild(initialsForm);
    initialsForm.setAttribute('id', 'form');
    let label = document.createElement('label');
    initialsForm.appendChild(label);
    label.textContent = 'Enter initials: '
    let input = document.createElement('input')
    initialsForm.appendChild(input);
    input.setAttribute('id', 'initials');
    let submit = document.createElement('button');
    initialsForm.appendChild(submit);
    submit.setAttribute('id', 'submit');
    submit.textContent = 'Submit';

    title.setAttribute('style', 'align-self: center')
    textBox.setAttribute('style', 'align-self: center');

    
    input.addEventListener('keydown', stopReload);
    submit.addEventListener('click', addScore);
    
}

function stopReload(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
    }
}

function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    let id = document.getElementById('initials');
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    ongoing = false;
    document.getElementById('form').remove();
    saveScore(id);
}

// local scores 
function saveScore(id) {
    if(localStorage.getItem('leaderboard') !== null) {
        ldrbrd = JSON.parse(localStorage.getItem('leaderboard'));
    }
    ldrbrd.push(`${score} ${id.value}`);
    localStorage.setItem('leaderboard', JSON.stringify(ldrbrd));
    showScores();    
}

// initials checker
function invalidInput() {
    answers.textContent = 'Initials must be two characters';
    clearAnswer();
    let submit = document.getElementById('submit');
    submit.addEventListener('click', addScore);
}

// end page
function showScores() {
    if(!ongoing) {
        title.textContent = 'HIGHSCORE';
        startBtn.setAttribute('style', 'display: none');
        writeScores();
        createEndButtons();
    } else if(title.textContent === 'Finished') {
        clearAnswer();
    } 
}

// leaderboard/highscores
function writeScores() {
    textBox.textContent = '';
    textBox.setAttribute('style', 'white-space: pre-wrap');
    if(localStorage.getItem('leaderboard') !== null) {
        ldrbrd = JSON.parse(localStorage.getItem('leaderboard'));
    }
    ldrbrd.sort();
    ldrbrd.reverse();
    let limit = 5;
    if(limit > ldrbrd.length) {
        limit = ldrbrd.length;
    }
    for(let i = 0; i < limit; i++) {
        textBox.textContent += ldrbrd[i] + '\n';
    }
}

function createEndButtons() {
    if(!document.getElementById('restart')) {
        let restartVar = document.createElement('button');
        container.appendChild(restartVar);
        restartVar.textContent = 'Home';
        restartVar.setAttribute('id', 'restart');
        
        let clearScoresVar = document.createElement('button');
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = 'Clear';
        clearScoresVar.setAttribute('id', 'clearScores');
        
        restartVar.addEventListener('click', restart);
        clearScoresVar.addEventListener('click', clearScores)
    }
}

// resets start page 
function restart() {
    document.getElementById('restart').remove();
    document.getElementById('clearScores').remove();
    title.textContent = 'Dollar Quiz';
    textBox.textContent = 'Click Start';
    startBtn.setAttribute('style', 'display: visible');
    curQstn = 0;
    score = 0;
    timeLeft = 31;
    init();
}

// clears local storage
function clearScores() {
    localStorage.clear();
    textBox.textContent = '';
    ldrbrd = [];
}

init();