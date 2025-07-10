
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        playerCard: document.getElementById("player-field-card"),
        computerCard: document.getElementById("computer-field-card")
    },
    playerSides: {
        player: "player-cards",
        playerBOX: document.getElementById("player-cards"),
        computer: "computer-cards",
        computerBOX: document.getElementById("computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia, the Forbidden One",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
]



async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        });

    }

    return cardImage;
}

async function setCardsField (idCard) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.playerCard.style.display = "block";
    state.fieldCards.computerCard.style.display = "block";

    hiddenCardDetails();

    state.fieldCards.playerCard.src = cardData[idCard].img;
    state.fieldCards.computerCard.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(idCard, computerCardId);
    

    await updateScore();
    await drawButton(duelResult);
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}


async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;

}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";

}

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)) {
        duelResult = "Win";
        await playAudio(duelResult.toLowerCase());
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId)) {
        duelResult = "Lose";
        await playAudio(duelResult.toLowerCase());
        state.score.computerScore++;
    }
    return duelResult;
    
}

async function removeAllCardsImages() {
    
    let { computerBOX, playerBOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.textContent = cardData[index].name;
    state.cardSprites.type.textContent = "Atribute: " + cardData[index].type;

}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);

    }

}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.playerCard.style.display = "none";
    state.fieldCards.computerCard.style.display = "none";

    init();
    
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();

}

function init() {
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.2;

    bgm.play();
}

init();