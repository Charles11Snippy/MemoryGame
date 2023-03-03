//** Main.js file */

const cardsArray = ['apple', 'plane', 'grape', 'cake', 'heart', 'rocket', 'apple', 'plane', 'grape', 'cake', 'heart', 'rocket' ];
const gameWrapper = document.querySelector('#game-wrapper');
const playerNameInput = document.querySelector('#name__input');
const playerName = document.querySelector('#player__name');
const goButton = document.querySelector('#modal__btn');
const modalWindow = document.querySelector('#modal-wrapper');
const wonWindow = document.querySelector('#win-window');
const loseWindow = document.querySelector('#lose-window');
const timerEl = document.querySelector('#timer');
let score = 0;
const openCards = [];
const timeLeft = 60;
let intervalId = null;
let gameStarted = false;

gsap.registerPlugin(EasePack);
let startTl = gsap.timeline();
let modalTl = gsap.timeline();

startTl.from('html', {opacity: 0, duration: 2})
       .from('.header__title', {opacity: 0, y: -100, duration: 1.5})
       .to('.header__title', {opacity: 0, y:100, display:'none', duration: 1.5}, "+=1")
       .from('#game-wrapper', {opacity: 0, x: -500, duration: 3})
       .from('#score-wrapper', {opacity: 0, y: -500, duration: 3}, '-=3')
       .from('#startButton', {opacity: 0,})
       .to('#startButton', {opacity: 1, duration: 1})
       .from('#modal-wrapper', {opacity: 0, duration: 1})
       .from('#main-modal', {opacity: 0, y: -100, duration: 1}, '-=1')

// CARDS SHUFFLE

// CARDS SHUFFLE

function shuffleCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    return cardsArray;
}

let shuffledCards = shuffleCards(cardsArray.slice(0, 12));


let cards = shuffledCards.map((card, index) => {
    return {
        id: index,
        img: `${card}.svg`
    };
});

// CARDS CREATION
function cardCreation() {

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.setAttribute('id', `card${card.id}`)
        cardEl.style.background = `#6175DC url('img/${card.img}') no-repeat center`;
    
        gameWrapper.appendChild(cardEl);
    });
}

cardCreation();

// CARDS CREATION

// GAME MANAGER

function handleModalBtnClick() {
    let playerNameValue = '';

    playerNameValue = playerNameInput.value;

    if(playerNameValue) {
        playerName.textContent = playerNameValue;
        modalTl.fromTo('#main-modal',{opacity: 1, y: 0}, {opacity: 0, y: -100, duration: 1})
               .fromTo(modalWindow, {opacity: 1, display: 'block'}, {opacity: 0, duration: 1, display: 'none'})
               .from(playerName, {opacity: 0, duration: 0.5});
    }
}

goButton.addEventListener('click', handleModalBtnClick);
playerNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleModalBtnClick();
    }
})

function startGameInitialize () {
    startGame(startButton);
    startTimer();
    console.log('start timer')
}

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', startGameInitialize);


function startGame(button) {
    gameStarted = true;
    button.textContent = 'Restart';
    button.removeEventListener('click', startGameInitialize);
    button.addEventListener('click', resetGame);
    gameWrapper.addEventListener('click', handlerClickCard);
}



function resetGame() {
    gameStarted = false;
    resetCards();
    clearInterval(intervalId);
    timerEl.textContent = '';
    timerEl.textContent = timeLeft;
    gameWrapper.innerHTML = '';
    let localShuffledCards = shuffleCards(cardsArray.slice(0, 12));
    cards = localShuffledCards.map((card, index) => {
        return {
            id: index,
            img: `${card}.svg`
        };
    })
    cardCreation();
    startButton.removeEventListener('click', resetGame);
    startButton.textContent = '';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', startGameInitialize)

}


// GAME MANAGER

// GAME LOGIC

function wonGame() {
    let tl = gsap.timeline({ onComplete: () => gsap.set("#won", {clearProps: true}) });
    tl.fromTo(wonWindow, {opacity: 0, display: 'none'}, {opacity: 1, display: 'block', duration: 1})
      .from('#won',{opacity: 0, y: -100, duration: 2})
      .to('#won', {opacity: 0, y: 100, duration: 2})
      .fromTo(wonWindow,{opacity: 1, display: 'block'}, {opacity: 0, display: 'none', duration: 1})
      .call(resetGame, null, 0)
    tl.restart();
}


function loseGame() {
    let tl = gsap.timeline({ onComplete: () => gsap.set("#lose", {clearProps: true}) });
    
    tl
      .fromTo(loseWindow,{opacity: 0, display: 'none'}, {opacity: 1, display: 'block', duration: 1})
      .from('#lose',{opacity: 0, y: -100, duration: 2})
      .to('#lose', {opacity: 0, y: 100, duration: 2, revert: true})
      .fromTo(loseWindow,{opacity: 1, display: 'block'}, {opacity: 0, display: 'none', duration: 1})
      .call(resetGame, null, 0)
    
}



function startTimer () {
    timerEl.textContent = timeLeft;
    let currentTime = timeLeft;
    if(gameStarted === true) {
        intervalId = setInterval(() => {
            if (gameStarted === false) {
                clearInterval(intervalId);
                return;
            }
            currentTime--;
            timerEl.textContent = currentTime;
            if (currentTime === 0) {
                // clearInterval(intervalId);
                loseGame();
                gameStarted = false;
                return;
            } else if (score === cards.length / 2 ) {
                // clearInterval(intervalId);
                wonGame();
                gameStarted = false;
                return;
            }  
        }, 1000)
    }

}

function resetCards () {
    const openCards = document.querySelectorAll('.open');
    openCards.forEach(card => {
        card.classList.remove('open');
    });
    score = 0;
    document.querySelector('#score').textContent = score;
}

function increaseScore() {
    score++;
    document.querySelector('#score').textContent = score;
}

function handlerClickCard (e) {
    const clickedCard = e.target.closest('.card');
    if (!clickedCard || openCards.length >= 2 ) return;

    clickedCard.classList.add('open');

    openCards.push(clickedCard);

    if (openCards.length == 2) {

        const[firstCard, secondCard] = openCards;

        if (firstCard === secondCard) {
            openCards.pop();
            return;
        }

        if (firstCard.style.background === secondCard.style.background) {

            openCards.length = 0;
            increaseScore();
        } else {

            setTimeout(() => {
                firstCard.classList.remove('open');
                secondCard.classList.remove('open');
                openCards.length = 0;
                resetCards();
            }, 1000);
        }
    }
}

// GAME LOGIC
