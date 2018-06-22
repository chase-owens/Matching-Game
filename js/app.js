//A list that holds all of the cards
const houseOfCards = ['fa-diamond', 'fa-diamond',
                    'fa-paper-plane-o', 'fa-paper-plane-o',
                    'fa-anchor', 'fa-anchor',
                    'fa-bolt', 'fa-bolt',
                    'fa-cube', 'fa-cube',
                    'fa-leaf', 'fa-leaf',
                    'fa-bomb', 'fa-bomb',
                    'fa-bicycle', 'fa-bicycle'];

const moveDisplay = document.querySelector('span'),
      deck = document.querySelector('.deck'),
      timer = document.querySelector('.timer'),
      stars = document.querySelectorAll('.fa-star'),
      restart = document.querySelector('.restart'),
      movesPTag = document.querySelector('.moves-p-tag'),
      modal = document.querySelector('.modal');

let cards = document.querySelectorAll('.card'),
    flippedCards = [],
    numberOfMoves = 0,
    numberOfMatches = 0,
    isCounting = false,
    seconds = 0,
    minutes = 0,
    numberOfStars = 5.0;

//putting eventlisteners for cards so it can be called when new cards are dealt
function gameReady() {
  let theCards = document.querySelectorAll('.card');
  theCards.forEach(function(card) {
    card.addEventListener('click', function() {

      //start timer when card is clicked
      setTimer();

      //this conditional was constructed after reading a Slack question by Winnie H and subsequent answers from Juan L
      if (flippedCards.length < 2) {
        
        //if the card is eligible to flip, flip it
        if (!card.classList.contains('open') && !card.classList.contains('match')) {
          flippedCards.push(card);
          card.classList.add('show', 'open');

          //if two cards are flipped,
          if (flippedCards.length == 2) {

            //add a move to number of moves
            updateMoves();

            //getting variables to compare to decide if cards match or not
            let firstCardType = flippedCards[0].querySelector('i').classList.item(1);
            let secondCardType = flippedCards[1].querySelector('i').classList.item(1);

            // Do the cards match???
            if (firstCardType === secondCardType) {
              flippedCards.forEach(function(card) {
                
                //add match class to card and keep face up
                flippedCards[0].classList.add('match');
                flippedCards[1].classList.add('match');
                
                //unflip cards
                while (flippedCards.length > 0) {
                  flippedCards.pop();
                }
                
                //keeping track of matches
                updateMatches();
              });

            } else {
              //function to turn cards back over if they do not match
              setTimeout(function() {
                flippedCards.forEach(function(card) {
                  card.classList.remove('show', 'open');
                });
                while(flippedCards.length > 0) {
                  flippedCards.pop();
                }
              }, 1000);
            }
          }

        } else {
          console.log('ineligible');
        }
      }
    });
  });
}

gameReady();

//Thanks to help from reading post in forum by Jenu P at url: https://knowledge.udacity.com/questions/1030
function updateMoves() {
  let fifthStar = document.getElementById('fifthStar'),
      fourthStar = document.getElementById('fourthStar'),
      thirdStar = document.getElementById('thirdStar'),
      secondStar = document.getElementById('secondStar'),
      firstStar = document.getElementById('firstStar');

  numberOfMoves += 1;

  if (numberOfMoves != 1) {
    movesPTag.innerText = numberOfMoves + " Moves"
    moveDisplay.style.marginRight = "5px";
  } else {
    movesPTag.innerText = numberOfMoves + " Move";
  }

  //once user reaches 18 moves, lose 1/2 star for each move
  switch (numberOfMoves) {
    case 18:
      fifthStar.classList.add('fa-star-half-full');
      numberOfStars -= 0.5;
      break;
    case 19:
      fifthStar.classList.remove('fa-star-half-full');
      fifthStar.classList.add('fa-star-o');
      numberOfStars -= 0.5;
      break;
    case 20:
      fourthStar.classList.add('fa-star-half-full');
      numberOfStars -= 0.5;
      break;
    case 21:
      fourthStar.classList.remove('fa-star-half-full');
      fourthStar.classList.add('fa-star-o');
      numberOfStars -= 0.5;
      break;
    case 22:
      thirdStar.classList.add('fa-star-half-full');
      numberOfStars -= 0.5;
      break;
    case 23:
      thirdStar.classList.remove('fa-star-half-full');
      thirdStar.classList.add('fa-star-o');
      numberOfStars -= 0.5;
      break;
    case 24:
      secondStar.classList.add('fa-star-half-full');
      numberOfStars -= 0.5;
      break;
    case 25:
      econdStar.classList.remove('fa-star-half-full');
      secondStar.classList.add('fa-star-o');
      numberOfStars -= 0.5;
      break;
    case 26:
      firstStar.classList.add('fa-star-half-full');
      numberOfStars -= 0.5;
      break;
    case 27:
      firstStar.classList.remove('fa-star-half-full');
      firstStar.classList.add('fa-star-o');
      numberOfStars -= 0.5;
      break;
    default:
      return numberOfMoves;
  }
}

//function to track matches. When all cards are matched, timer is stopped and modal appears
function updateMatches() {
  numberOfMatches += 1;
  if (numberOfMatches == 8) {
    stopTimer();
    modal.style.display = "flex";

    let winComment = document.querySelector('.win-comment');
    let newGameButton = document.querySelector('.submit-button');
    let observeButton = document.querySelector('.cancel-button');

    //win comment depending on how long it took user to complete game
    if (minutes == 0) {
      winComment.innerText = "You matched all of the cards in " + seconds + " seconds and only " + numberOfMoves + " moves! \n\nThat is a " + numberOfStars + "-star performance! \n\nWould you like to observe and admire your performance or start a new game?";
    } else if (minutes == 1) {
      winComment.innerText = "You matched all of the cards in " + minutes + " minute and " + seconds + " seconds and only " + numberOfMoves + " moves! \n\nThat is a " + numberOfStars + "-star performance! \n\nWould you like to observe and admire your performance or start a new game?";
    } else {
      winComment.innerText = "You matched all of the cards in " + minutes + " minutes and " + seconds + " seconds and only " + numberOfMoves + " moves! \n\nThat is a " + numberOfStars + "-star performance! \n\nWould you like to observe and admire your performance or start a new game?";
    }

    //close modal
    observeButton.addEventListener('click', function() {
      modal.style.display = "none";
    });

    //if user selects new game, modal is removed, stars, number of moves, and timer is reset, cards are flipped back over and reshuffled, then the event listener for each card is readded
    newGameButton.addEventListener('click', function() {
      modal.style.display = "none";
      newGame();
      restartGame();
      newDeck();
      gameReady();
    });
  }
}

//set timer if timer has not ben set, set timer to execute code every 1000 miliseconds
function setTimer() {
  if (isCounting == false) {
    count = setInterval(startTimer, 1000);
  }
  isCounting = true;
}

//start timer add second every execution, when 60 seconds have accumulated, add minute and reset seconds, and set timer text to display minutes and seconds
function startTimer() {
  timer.style.paddingLeft = "5px";
  seconds += 1;

  if (seconds == 60) {
    minutes += 1;
    seconds = 0;
  }

  if (minutes < 1 && seconds < 10) {
    timer.innerText = "0" + seconds + " sec";
  } else if (minutes < 1) {
    timer.innerText = seconds + " sec";
  } else if (minutes >= 1 && seconds < 10) {
    timer.innerText = minutes + " : 0" + seconds;
  } else {
    timer.innerText = minutes + " : " + seconds;
  }
}

//function to stop timer
function stopTimer() {
  clearInterval(count);
  isCounting = false;
  timer.style.paddingLeft = "0";
}

//new game that resets board and displays
function newGame() {
  stopTimer();
  numberOfMoves = 0;
  movesPTag.innerText = numberOfMoves + " Moves";
  numberOfMatches = 0;
  numberOfStars = 5;
  seconds = 0;
  minutes = 0;
  timer.innerText = "";


  stars.forEach(function(star) {
    if (star.classList.contains('fa-star-half-full')) {
      star.classList.remove('fa-star-half-full');
    } else if (star.classList.contains('fa-star-o')) {
      star.classList.remove('fa-star-o');
    }
  });
}

//function that reflips cards so user can restart the current game
function restartGame() {
  while (flippedCards.length > 0) {
    flippedCards.pop();
  }
  let theseCards = document.querySelectorAll('.card');
  theseCards.forEach(function(card) {
    if (card.classList.contains('match')) {
      card.classList.remove('match', 'show', 'open');
    } else if (card.classList.contains('show')) {
      card.classList.remove('show', 'open');
    }
    else {
      return card;
    }
  });
}

//restart button event listener - calls newgame and restart game function - does not shuffle deck
restart.addEventListener('click', function() {
  newGame();
  restartGame();
});

//function to shuffle deck
function newDeck() {
  removeOldCards();
  createCard();
}

//function to remove old cards 
function removeOldCards() {
  cards.forEach(function(card) {
    card.parentNode.removeChild(card);
  });
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function createCard() {
  let newDeck = shuffle(houseOfCards);
  newDeck.forEach(function(card) {
    let newCard = document.createElement('li');
    let innerCard = document.createElement('i');
    newCard.setAttribute('class', 'card');
    innerCard.setAttribute('class', 'fa');
    innerCard.classList.add(card);
    newCard.appendChild(innerCard);
    deck.appendChild(newCard);
    return card;
  });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
