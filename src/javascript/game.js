const sections = document.querySelectorAll('section'); // Sélectionne toutes les sections de la page
const preGame = document.getElementById('pregame');
const gaming = document.getElementById('gaming');
const gameBoard = document.getElementById('game-board'); // Sélectionne le conteneur du plateau de jeu
const movesDisplay = document.getElementById('moves'); // Sélectionne l'affichage du score
const gameSettings = document.getElementById('game-settings'); // Sélectionne le conteneur des options de jeu
const startButton = document.getElementById('start-game'); // Sélectionne le bouton de démarrage du jeu
const boardSizeSelect = document.getElementById('board-size'); // Sélectionne le menu déroulant de la taille du plateau
const cardTypeSelect = document.getElementById('card-type'); // Sélectionne le menu déroulant du type de cartes
let rows, cols;
let firstCard = null; // Carte cliquée en premier
let secondCard = null; // Carte cliquée en second
let lockBoard = false; // Empêche les cartes d'être retournées pendant la vérification de correspondance
let moves = 0; // Nombre de mouvements effectués ou score
let matchedPairs = 0; // Nombre de paires de cartes trouvées

// EventListener pour la barre espace
document.addEventListener('keydown', function(event) {
    if (!document.querySelector('input:focus')) { // vérifie qu'on ne se trouve pas dans un input field
        if (event.code === 'Space' || event.key === ' ') {
            resetGame();
        }
    }
});

startButton.addEventListener('click', () => startGame());

function startGame() {
    [rows, cols] = boardSizeSelect.value.split('x').map(Number); // Obtient les valeurs de lignes et de colonnes pour le plateau
    const cardType = cardTypeSelect.value; // Obtient le type de carte sélectionné
    preGame.style.display = 'none'; // Cache les options de jeu
    gaming.style.visibility = 'visible'; // Rend visible l'affichage du jeu
    gameBoard.innerHTML = ''; // Vide le plateau de jeu
    moves = 0; // Réinitialise le compteur de mouvements
    matchedPairs = 0; // Réinitialise le compteur de paires assorties
    movesDisplay.innerText = `Tours : ${moves}`; // Affiche le nombre initial de mouvements
    const cardsArray = generateCardsArray(rows * cols); // Génère un tableau de cartes
    createBoard(cardsArray, cardType); // Crée le plateau de jeu
}

function generateCardsArray(numberOfCards) {
    const numberOfPairs = numberOfCards / 2; // Calcule le nombre de paires nécessaires
    const baseCards = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Change le string en un array contenant chaque lettre
    let cardsArray = [];

    // Génère les paires de cartes
    for (let i = 0; i < numberOfPairs; i++) {
        const cardValue = baseCards[i];
        cardsArray.push(cardValue, cardValue);
    }

    return cardsArray.sort(() => 0.5 - Math.random()); // Mélange les cartes
}

function createBoard(cardsArray, type) {
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`; // Définit le nombre de colonnes en fonction de la taille du plateau

    // Crée chaque carte sur le plateau de jeu
    cardsArray.forEach(card => { // Pour chaque carte (ou lettre) dans l'array :
        const cardElement = document.createElement('div'); // Element mère qui représente la carte
        cardElement.classList.add('card');

        const cardInner = document.createElement('div');// Element qui sert à tenir le recto et le verso
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        // Si le joueur a choisi un set d'images, ajoute l'image correspondant à la lettre dans le set choisi, sinon, ajoute la lettre en texte
        if (type !== 'letters') {
            const cardImage = document.createElement('img');
            cardImage.src = `images/${type}/${card}.png`;
            cardFront.appendChild(cardImage);
        } else {
            cardFront.textContent = card;
        }

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.dataset.value = card; // Attribue une data-value
        cardElement.addEventListener('click', flipCard); // Ajoute un événement de clic pour retourner la carte
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return; // Si le plateau est verrouillé, ignore le clic
    if (this === firstCard) return; // Si la carte cliquée est déjà retournée, ignore le clic

    this.classList.add('flipped');

    if (!firstCard) { // Null est falsy, un string non vide est truthy
        firstCard = this; // Si firstCard est Null, on enregistre la carte
        return;
    }

    secondCard = this; // Enregistre la deuxième carte
    lockBoard = true; // Verrouille le plateau pour empêcher d'autres clics
    moves++; // Incrémente le nombre de mouvements
    movesDisplay.innerText = `Tours : ${moves}`; // Met à jour l'affichage des mouvements

    checkForMatch(); // Vérifie si les cartes correspondent
}

function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value; // Vérifie si les cartes correspondent
    if (isMatch) {
        disableCards(); // Désactive les cartes assorties
        matchedPairs++; // Incrémente le nombre de paires assorties
        checkForWin(); // Vérifie s'il y a une victoire
    } else {
        unflipCards(); // Retourne les cartes
    }
}

// Enlève les event listener quand une paire est trouvée
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetPlay();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetPlay();
    }, 1000); // Attend 1 seconde avant de retourner les cartes
}

// Oublie les cartes sélectionnées et débloque le jeu
function resetPlay() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function checkForWin() {
    const totalPairs = (cols * rows) / 2;
    if (matchedPairs === totalPairs) {
        const size = cols + 'x' + rows;
        setTimeout(() => {
            alert(`Bravo! Votre score est de ${moves} tours !`);
            resetGame();
            saveScore(moves, size)


        }, 500);
    }
}



function resetGame() {
    preGame.style.display = 'block';
    gaming.style.visibility = 'hidden';
    gameBoard.innerHTML = '';
}
