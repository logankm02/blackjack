const cards = [
  ["2 of Clubs", 2, "cards/2_of_clubs.png"],
  ["3 of Clubs", 3, "cards/3_of_clubs.png"],
  ["4 of Clubs", 4, "cards/4_of_clubs.png"],
  ["5 of Clubs", 5, "cards/5_of_clubs.png"],
  ["6 of Clubs", 6, "cards/6_of_clubs.png"],
  ["7 of Clubs", 7, "cards/7_of_clubs.png"],
  ["8 of Clubs", 8, "cards/8_of_clubs.png"],
  ["9 of Clubs", 9, "cards/9_of_clubs.png"],
  ["10 of Clubs", 10, "cards/10_of_clubs.png"],
  ["Jack of Clubs", 10, "cards/jack_of_clubs.png"],
  ["Queen of Clubs", 10, "cards/queen_of_clubs.png"],
  ["King of Clubs", 10, "cards/king_of_clubs.png"],
  ["Ace of Clubs", 1, "cards/ace_of_clubs.png"],

  ["2 of Diamonds", 2, "cards/2_of_diamonds.png"],
  ["3 of Diamonds", 3, "cards/3_of_diamonds.png"],
  ["4 of Diamonds", 4, "cards/4_of_diamonds.png"],
  ["5 of Diamonds", 5, "cards/5_of_diamonds.png"],
  ["6 of Diamonds", 6, "cards/6_of_diamonds.png"],
  ["7 of Diamonds", 7, "cards/7_of_diamonds.png"],
  ["8 of Diamonds", 8, "cards/8_of_diamonds.png"],
  ["9 of Diamonds", 9, "cards/9_of_diamonds.png"],
  ["10 of Diamonds", 10, "cards/10_of_diamonds.png"],
  ["Jack of Diamonds", 10, "cards/jack_of_diamonds.png"],
  ["Queen of Diamonds", 10, "cards/queen_of_diamonds.png"],
  ["King of Diamonds", 10, "cards/king_of_diamonds.png"],
  ["Ace of Diamonds", 1, "cards/ace_of_diamonds.png"],

  ["2 of Hearts", 2, "cards/2_of_hearts.png"],
  ["3 of Hearts", 3, "cards/3_of_hearts.png"],
  ["4 of Hearts", 4, "cards/4_of_hearts.png"],
  ["5 of Hearts", 5, "cards/5_of_hearts.png"],
  ["6 of Hearts", 6, "cards/6_of_hearts.png"],
  ["7 of Hearts", 7, "cards/7_of_hearts.png"],
  ["8 of Hearts", 8, "cards/8_of_hearts.png"],
  ["9 of Hearts", 9, "cards/9_of_hearts.png"],
  ["10 of Hearts", 10, "cards/10_of_hearts.png"],
  ["Jack of Hearts", 10, "cards/jack_of_hearts.png"],
  ["Queen of Hearts", 10, "cards/queen_of_hearts.png"],
  ["King of Hearts", 10, "cards/king_of_hearts.png"],
  ["Ace of Hearts", 1, "cards/ace_of_hearts.png"],

  ["2 of Spades", 2, "cards/2_of_spades.png"],
  ["3 of Spades", 3, "cards/3_of_spades.png"],
  ["4 of Spades", 4, "cards/4_of_spades.png"],
  ["5 of Spades", 5, "cards/5_of_spades.png"],
  ["6 of Spades", 6, "cards/6_of_spades.png"],
  ["7 of Spades", 7, "cards/7_of_spades.png"],
  ["8 of Spades", 8, "cards/8_of_spades.png"],
  ["9 of Spades", 9, "cards/9_of_spades.png"],
  ["10 of Spades", 10, "cards/10_of_spades.png"],
  ["Jack of Spades", 10, "cards/jack_of_spades.png"],
  ["Queen of Spades", 10, "cards/queen_of_spades.png"],
  ["King of Spades", 10, "cards/king_of_spades.png"],
  ["Ace of Spades", 1, "cards/ace_of_spades.png"],
];

let bank = 1000;
let betAmount = 0;
let insuranceBet = 0;
let hasHit = false;
let turnOver = false;
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerBusted = false;
let betsOn = true;
let gotBlackjack = false;

const dealerCards = document.querySelector(".dealer-cards p");
const playerCards = document.querySelector(".player-cards p");
const playerTotal = document.querySelector(".player-total p");
const playerTurn = document.querySelector(".player-turn p");
const dealerTotal = document.querySelector(".dealer-total p");
const dealerTurn = document.querySelector(".dealer-turn p");
const betDisplay = document.querySelector(".bet p");
const insuranceBetDisplay = document.querySelector(".insurance-bet p");
const result = document.querySelector(".result p");

const betForm = document.querySelector(".bet-form");
const betFormAmount = document.getElementById("betForm");
const betCounter = betForm.querySelector("h2");
const betAmountDisplay = betFormAmount.querySelector("p");
const betButtons = document.querySelectorAll(".bet-button");

document.getElementById("betForm").addEventListener("submit", function (event) {
  event.preventDefault();
});

// Set up the bet buttons
betButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const amountToAdd = parseInt(button.value);
    betAmount += amountToAdd;
    betCounter.innerHTML = convertBetToChips(betAmount);

    let betCounterHTML = `Bet Amount: ${betAmount}<br>`;
    betAmountDisplay.innerHTML = betCounterHTML;
  });
});

/* 
Helper Functions
*/

function getHandTotal(hand) {
  let total1 = 0;
  let total11 = 0;
  let aces = 0;

  for (let card of hand) {
    let [name, value] = card;
    total1 += value;
    total11 += value;
    if (name.startsWith("Ace")) aces += 1;
  }

  if (aces > 0) total11 += aces * 10;

  while (total11 > 21 && aces > 0) {
    total11 -= 10;
    aces -= 1;
  }
  return total1 === total11 || total11 > 21 ? total1 : [total1, total11];
}

function getFinalTotal(hand) {
  let total = getHandTotal(hand);
  return Array.isArray(total) ? total[1] : total;
}

function displayDealerCards() {
  let dealerCardsHTML = `<img src="${dealerHand[0][2]}" alt="Card" class="card-image">`;
  for (let i = 1; i < dealerHand.length; i++) {
    dealerCardsHTML += `<img src="${dealerHand[i][2]}" alt="Card" class="card-image">`;
  }
  dealerCards.innerHTML = dealerCardsHTML;
  dealerTotal.innerHTML = formatHandTotal(getHandTotal(dealerHand), "Dealer");
}

function updateBank() {
  document.querySelector(".bank p").innerHTML = `Bank: ${bank}`;
}

function formatHandTotal(total, owner) {
  if (Array.isArray(total) && total.length === 2) {
    return `${owner} Total: ${total[0]} or ${total[1]}`; // If it's a tuple, return two numbers separated by a comma
  } else {
    return `${owner} Total: ${total}`; // If it's not a tuple, just convert it to a string
  }
}

function convertBetToChips(betAmount) {
  let betCounterHTML = "";
  let betCount = betAmount;
  while (betCount > 0) {
    if (betCount >= 100) {
      betCount -= 100;
      betCounterHTML += `<img src="poker_chips/black.png" alt="Bet" class="bet-image">`;
    } else if (betCount >= 25) {
      betCount -= 25;
      betCounterHTML += `<img src="poker_chips/green.png" alt="Bet" class="bet-image">`;
    } else if (betCount >= 10) {
      betCount -= 10;
      betCounterHTML += `<img src="poker_chips/red.png" alt="Bet" class="bet-image">`;
    } else if (betCount >= 5) {
      betCount -= 5;
      betCounterHTML += `<img src="poker_chips/blue.png" alt="Bet" class="bet-image">`;
    }
  }
  return betCounterHTML;
}

function generateButtons() {
  // Clear any existing buttons before appending new ones
  document.querySelectorAll(".button-container").forEach((buttonContainer) => {
    buttonContainer.remove();
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  // Append button container to the document body directly
  document.body.appendChild(buttonContainer);

  if (!turnOver) {
    const hitButton = document.createElement("button");
    hitButton.textContent = "Hit";
    hitButton.className = "hit";
    hitButton.addEventListener("click", function (event) {
      event.preventDefault();
      hit();
    });
    buttonContainer.appendChild(hitButton);
  }

  if (!turnOver) {
    const standButton = document.createElement("button");
    standButton.textContent = "Stand";
    standButton.className = "stand";
    standButton.addEventListener("click", function (event) {
      event.preventDefault();
      stand();
    });
    buttonContainer.appendChild(standButton);
  }

  if (canDoubleDown()) {
    const doubleDownButton = document.createElement("button");
    doubleDownButton.textContent = "Double Down";
    doubleDownButton.className = "double-down";
    doubleDownButton.addEventListener("click", function (event) {
      event.preventDefault();
      doubleDown();
    });
    buttonContainer.appendChild(doubleDownButton);
  }

  if (canGetInsurance()) {
    const insuranceButton = document.createElement("button");
    insuranceButton.textContent = "Insurance";
    insuranceButton.className = "insurance";
    insuranceButton.addEventListener("click", function (event) {
      event.preventDefault();
      insurance();
    });
    buttonContainer.appendChild(insuranceButton);
  }

  // if (canSplit()) {
  //     const splitButton = document.createElement('button');
  //     splitButton.textContent = 'Split';
  //     splitButton.className ='split';
  //     splitButton.addEventListener('click', function(event) {
  //         event.preventDefault();
  //         split();
  //         determineWinner();
  //     });
  //     buttonContainer.appendChild(splitButton);
  // }

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.className = "reset";
  resetButton.addEventListener("click", function (event) {
    event.preventDefault();
    reset();
  });
  buttonContainer.appendChild(resetButton);
}

function canSplit() {
  if (hasHit || playerHand.length !== 2) return false;
  let card1Value = playerHand[0][1];
  let card2Value = playerHand[1][1];
  return card1Value == card2Value;
}

function canDoubleDown() {
  if (hasHit || turnOver || playerHand.length !== 2) return false;
  if (getFinalTotal(playerHand) === 21) return false;
  let totalsAllowed = [9, 10, 11];
  let total = getHandTotal(playerHand);
  return Array.isArray(total)
    ? totalsAllowed.includes(total[0]) || totalsAllowed.includes(total[1])
    : totalsAllowed.includes(total);
}

function canGetInsurance() {
  return (
    insuranceBet === 0 && !turnOver && !hasHit && dealerHand[0][0][0] === "A"
  );
}

function checkBetsOn() {
  if (!betsOn) {
    document.querySelector(".bank p").classList.add("hidden");
    console.log("bets are off");
    betAmount = 0;
    const betForm = document.getElementById("betForm");
    betForm.classList.add("hidden");
    dealCards();
    generateButtons();
  }
}

function determineWinner() {
  dealerTurn.innerHTML = "";
  let playerTotalValue = getFinalTotal(playerHand);
  let dealerTotalValue = getFinalTotal(dealerHand);
  console.log("Final total player: " + playerTotalValue);
  console.log("Final total dealer: " + dealerTotalValue);
  if (gotBlackjack) {
    console.log("Player Wins!");
    result.innerHTML = "Blackjack! Player Wins!";
    betDisplay.innerHTML += betDisplay.innerHTML;
    bank += 2.5 * betAmount;
    updateBank();
    return 1;
  } else if (playerTotalValue > 21) {
    console.log("Player Busted!");
    result.innerHTML = "Player Busted!";
    betDisplay.innerHTML = "";
    updateBank();
    return -1;
  } else if (dealerTotalValue > 21) {
    console.log("Dealer Busted!");
    result.innerHTML = "Dealer Busted!";
    if (!playerBusted) {
      result.innerHTML = "Dealer Busted! Player Wins!";
      betDisplay.innerHTML += betDisplay.innerHTML;
      bank += 2 * betAmount;
      updateBank();
    }
    return 1;
  } else if (playerTotalValue > dealerTotalValue) {
    console.log("Player Wins!");
    result.innerHTML = "Player Wins!";
    bank += 2 * betAmount;
    betDisplay.innerHTML += betDisplay.innerHTML;
    updateBank();
    return 1;
  } else if (playerTotalValue < dealerTotalValue) {
    console.log("Dealer Wins!");
    result.innerHTML = "Dealer Wins!";
    betDisplay.innerHTML = "";
    updateBank();
    return -1;
  } else {
    console.log("Push!");
    bank += betAmount;
    result.innerHTML = "Push!";
    updateBank();
    return 0;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* 

Game Actions

*/

function split() {
  console.log("splitting");
}

function doubleDown() {
  betAmount *= 2;
  let newCard = deck.pop();
  playerHand.push(newCard);
  let playerCardsHTML = "";
  for (let i = 0; i < playerHand.length; i++) {
    playerCardsHTML += `<img src="${playerHand[i][2]}" alt="Card" class="card-image">`;
  }
  playerCards.innerHTML = playerCardsHTML;
  playerTotal.innerHTML = formatHandTotal(getHandTotal(playerHand), "Player");
  betDisplay.innerHTML = convertBetToChips(betAmount);
  stand();
}

function insurance() {
  console.log("Getting insurance");
  insuranceBet = parseFloat(0.5 * betAmount);
  bank -= insuranceBet;
  updateBank();
  insuranceBetDisplay.innerHTML = convertBetToChips(insuranceBet);
  generateButtons();
}

function hit() {
  hasHit = true;
  let newCard = deck.pop();
  playerHand.push(newCard);
  let playerCardsHTML = "";
  for (let i = 0; i < playerHand.length; i++) {
    playerCardsHTML += `<img src="${playerHand[i][2]}" alt="Card" class="card-image">`;
  }
  playerCards.innerHTML = playerCardsHTML;
  playerTotal.innerHTML = formatHandTotal(getHandTotal(playerHand), "Player");
  if (getFinalTotal(playerHand) > 21) {
    console.log("Player Busted!");
    playerBusted = true;
    result.innerHTML = "Player Busted!";
    betDisplay.innerHTML = "";
    updateBank();
    stand();
  }
  generateButtons();
}

async function stand() {
  await delay(200);
  playerTurn.innerHTML = "";
  dealerTurn.innerHTML = "Dealer's Turn";
  turnOver = true;
  generateButtons();
  dealerCards.innerHTML = `<img src="${dealerHand[0][2]}" alt="Card" class="card-image">`;

  await delay(500);
  displayDealerCards();

  let finalTotal = getFinalTotal(dealerHand);
  if (finalTotal === 21) {
    console.log("Dealer Wins!");
    result.innerHTML = "Blackjack! Dealer Wins!";
    if (insuranceBet > 0) {
      insuranceBetDisplay.innerHTML += insuranceBetDisplay.innerHTML;
      bank += 2 * insuranceBet;
      console.log("Got insurance!");
    }
    updateBank();
    return -1;
  } else {
    insuranceBetDisplay.innerHTML = "";
  }

  while (true) {
    await delay(800);
    finalTotal = getFinalTotal(dealerHand);
    console.log(dealerHand);
    if (finalTotal >= 17) break;

    let newCard = deck.pop();
    dealerHand.push(newCard);
    displayDealerCards();
    dealerTotal.innerHTML = formatHandTotal(getHandTotal(dealerHand), "Dealer");
  }

  if (finalTotal > 21) {
    console.log("Dealer Busted!");
  } else {
    console.log(finalTotal);
  }

  determineWinner();
}

/* 

Game Play

*/

function reset() {
  turnOver = false;
  gotBlackjack = false;
  deck = [];
  playerHand = [];
  dealerHand = [];
  result.innerHTML = "";
  dealerCards.innerHTML = "";
  dealerTotal.innerHTML = "";
  playerCards.innerHTML = "";
  playerTotal.innerHTML = "";
  betDisplay.innerHTML = "";
  insuranceBetDisplay.innerHTML = "";
  playerBusted = false;
  insuranceBet = 0;
  betAmount = 0;
  betCounter.innerHTML = "";
  betAmountDisplay.innerHTML = "";

  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.innerHTML = "";

  const betForm = document.querySelector(".bet-form");
  betForm.classList.remove("hidden");

  play();
}

function bet() {
  console.log("Bet Amount:", betAmount);

  betDisplay.innerHTML = `Bet: ${betAmount}`;

  betDisplay.innerHTML = convertBetToChips(betAmount);

  bank -= betAmount;
  updateBank();

  const betForm = document.querySelector(".bet-form");
  betForm.classList.add("hidden");
  dealCards();
  generateButtons();
}

function dealCards() {
  playerTurn.innerHTML = "Your Turn";
  deck = [...cards];
  deck.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 2; i++) {
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
  }

  // Get initial cards
  dealerCards.innerHTML = `<img src="${dealerHand[0][2]}" alt="Card" class="card-image">`;
  playerCards.innerHTML = `<img src="${playerHand[0][2]}" alt="Card" class="card-image"><img src="${playerHand[1][2]}" alt="Card" class="card-image">`;

  // Get initial totals
  playerTotal.innerHTML = formatHandTotal(getHandTotal(playerHand), "Player");

  if (getFinalTotal(playerHand) === 21) {
    console.log("Player Wins!");
    result.innerHTML = "Blackjack! Player Wins!";
    betDisplay.innerHTML;
    bank += betAmount * 2.5;
    gotBlackjack = true;

    let originalHTML = betDisplay.innerHTML;

    betDisplay.innerHTML += originalHTML;

    let halfLength = Math.floor(originalHTML.length / 2);
    betDisplay.innerHTML += originalHTML.substring(0, halfLength);

    updateBank();
    stand();
  }
}

function play() {
  checkBetsOn();
  updateBank();
}

play();
