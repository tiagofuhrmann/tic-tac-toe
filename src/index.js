import { createHr } from "./accessory.js";
import "../styles/index.css";

const victoryConditions = [
    {
        victoryDirection: "victoryHorizontal",
        conditions: [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
        ],
    },
    {
        victoryDirection: "victoryVertical",
        conditions: [
            ["1", "4", "7"],
            ["2", "5", "8"],
            ["3", "6", "9"],
        ],
    },
    { victoryDirection: "victoryDiagonal1", conditions: [["1", "5", "9"]] },

    { victoryDirection: "victoryDiagonal2", conditions: [["7", "5", "3"]] },
];

let currentPlayer = 0;
let winDirection;
let playCount = 0;
let players = [
    { playerNumber: "1", symbol: "", name: "", wins: 0 },
    { playerNumber: "2", symbol: "", name: "", wins: 0 },
];
let gameStatus = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

const saveGame = () => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("playCount", playCount);
    localStorage.setItem("gameStatus", JSON.stringify(gameStatus));
};

const restoreGame = () => {
    let retrievedPlayers = localStorage.getItem("players");
    let retrievedPlayCount = localStorage.getItem("playCount");
    let retrievedCurrentPlayer = localStorage.getItem("currentPlayer");
    let retrievedGameStatus = localStorage.getItem("gameStatus");

    if (retrievedPlayers && retrievedPlayCount && retrievedCurrentPlayer !== undefined && retrievedGameStatus) {
        document.getElementById("gameInfo").style.height = "230px";
        document.getElementById("gameResult").innerText = "Em andamento...";
        document.getElementById("pageTitle").classList.add("hidden");
        document.getElementById("gameInfo").style.marginTop = "-40px";
        players = JSON.parse(retrievedPlayers);
        playCount = retrievedPlayCount;
        currentPlayer = retrievedCurrentPlayer;
        gameStatus = JSON.parse(retrievedGameStatus);
        console.log(gameStatus);

        gameStatus.forEach((row, rowIndex) => {
            row.forEach((playerInSquare, columnIndex) => {
                const square = document.querySelector(`[data-region = "${rowIndex}-${columnIndex}"]`);
                if (!playerInSquare == "") {
                    square.dataset.selectedByPlayer = playerInSquare;
                    square.innerText = players[playerInSquare - 1].symbol;
                    square.classList.add(`player${playerInSquare}Color`);
                }
            });
        });

        document.querySelector(".player1Name").innerText = players[0].name;
        document.querySelector(".player2Name").innerText = players[1].name;

        document.getElementById("startGameBtn").classList.add("displayNone");
        document.querySelector(".playerData").classList.remove("displayNone");

        players.forEach((player) => {
            if (player.wins > 0) {
                for (let i = 1; i <= player.wins; i++) {
                    let dot = document.getElementById(`player${player.playerNumber}-dot${i}`);
                    dot.classList.add(`filledDotp${player.playerNumber}`);
                }
            }
        });

        document.querySelector(`.player${currentPlayer}Turn`).classList.remove("hidden");
        console.log("Game restored sucessfully");
    } else {
        console.log("Game data doesn't exist or is corrupted");
    }
};

function restartGameStatus() {
    gameStatus = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    playCount = 0;
}

function newGameHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add("displayNone");
    const gameStartContainer = document.getElementById("gameStartContainer");
    const confirmStartBtn = document.getElementById("confirmStartBtn");

    const inputX1 = document.getElementById("player1XInput");
    const inputX2 = document.getElementById("player2XInput");
    const inputO1 = document.getElementById("player1OInput");
    const inputO2 = document.getElementById("player2OInput");

    document.getElementById("player1XInput").addEventListener("click", function () {
        inputX2.checked = "false";
        inputO2.checked = "true";
    });
    document.getElementById("player1OInput").addEventListener("click", function () {
        inputO1.checked = "false";
        inputX2.checked = "true";
    });
    document.getElementById("player2XInput").addEventListener("click", function () {
        inputX1.checked = "false";
        inputO1.checked = "true";
    });
    document.getElementById("player2OInput").addEventListener("click", function () {
        inputO1.checked = "false";
        inputX1.checked = "true";
    });

    const nameInput1 = document.getElementById("player1NameInput");
    const nameInput2 = document.getElementById("player2NameInput");

    confirmStartBtn.addEventListener("click", function () {
        if (
            nameInput1.value &&
            nameInput2.value &&
            document.querySelector("input[name='player1SymbolInput']:checked")
        ) {
            document.getElementById("gameResult").innerText = "Em andamento...";
            document.getElementById("gameInfo").style.marginTop = "-40px";
            currentPlayer = 1;
            players[0].name = nameInput1.value;
            players[0].symbol = document.querySelector("input[name='player1SymbolInput']:checked").value;
            players[1].name = nameInput2.value;
            players[1].symbol = document.querySelector("input[name='player2SymbolInput']:checked").value;
            document.querySelector(".player1Name").innerText = `${players[0].name}`;
            document.querySelector(".player2Name").innerText = players[1].name;
            document.querySelector(".player1Turn").classList.remove("hidden");
            saveGame();
            gameStartContainer.style.height = "0px";
            gameStartContainer.style.border = "0px";
            document.querySelector(".playerData").classList.remove("displayNone");
            document.getElementById("gameInfo").style.height = "230px";
            document.getElementById("pageTitle").style.opacity = "0";
        } else {
            alert("Preencha os campos corretamente!");
        }
    });

    document.querySelector(".title").style.fontSize = "24px";
    gameStartContainer.style.height = "270px";
    gameStartContainer.style.border = "3px solid black";
}

function restartRound(ev) {
    ev.preventDefault();

    const continueGameBtn = document.querySelector(".continueGameBtn");
    continueGameBtn.removeEventListener("click", restartRound);
    continueGameBtn.style.height = "0px";
    continueGameBtn.style.border = "0px";

    document.querySelector(".player1Turn").innerText = "Sua vez!";
    document.querySelector(".player2Turn").innerText = "Sua vez!";
    document.querySelector(".player1Turn").classList.add("hidden");
    document.querySelector(".player2Turn").classList.add("hidden");
    document.querySelector(`.player${currentPlayer}Turn`).classList.remove("hidden");
    document.querySelectorAll(".gameSquare").forEach(function (square) {
        square.dataset.selectedByPlayer = "";
        square.innerText = "";
        square.addEventListener("click", gameInnerWorkings);
        square.classList.remove("player1Color");
        square.classList.remove("player2Color");
    });
    document.querySelector(".player1Info").classList.remove("displayNone");
    document.querySelector(".player2Info").classList.remove("displayNone");
    document.getElementById("gameResult").innerText = "Em andamento...";

    restartGameStatus();
    saveGame();
}

function checkVitory() {
    victoryConditions.forEach(function (direction) {
        direction.conditions.forEach(function (condition) {
            let square1SelectedBy = document.querySelector("#gameSquare-" + condition[0]).dataset.selectedByPlayer;
            let square2SelectedBy = document.querySelector("#gameSquare-" + condition[1]).dataset.selectedByPlayer;
            let square3SelectedBy = document.querySelector("#gameSquare-" + condition[2]).dataset.selectedByPlayer;

            if (
                square1SelectedBy === square2SelectedBy &&
                square2SelectedBy === square3SelectedBy &&
                square1SelectedBy &&
                square2SelectedBy &&
                square3SelectedBy
            ) {
                winDirection = direction.victoryDirection;
                let playerWinner = square1SelectedBy;
                let winnerTurnInfo = document.querySelector(".player" + playerWinner + "Turn");
                winnerTurnInfo.innerText = "Vencedor!";
                winnerTurnInfo.classList.remove("hidden");

                const hr1 = createHr(winDirection);
                const hr2 = createHr(winDirection);
                const hr3 = createHr(winDirection);

                document.querySelector(`#gameSquare-${condition[0]}`).appendChild(hr1);
                document.querySelector(`#gameSquare-${condition[1]}`).appendChild(hr2);
                document.querySelector(`#gameSquare-${condition[2]}`).appendChild(hr3);

                if (playerWinner == 1) {
                    document.querySelector(".player2Turn").classList.add("hidden");
                    hr1.classList.add("player1WinLine");
                    hr2.classList.add("player1WinLine");
                    hr3.classList.add("player1WinLine");
                    players[0].wins++;
                } else if (playerWinner == 2) {
                    document.querySelector(".player1Turn").classList.add("hidden");
                    hr1.classList.add("player2WinLine");
                    hr2.classList.add("player2WinLine");
                    hr3.classList.add("player2WinLine");
                    players[1].wins++;
                }

                for (let i = 1; i <= players[playerWinner - 1].wins; i++) {
                    let dot = document.getElementById(`player${playerWinner}-dot${i}`);
                    dot.classList.add(`filledDotp${playerWinner}`);
                }

                let matchEnded = false;
                players.forEach((player) => {
                    if (player.wins == 5) {
                        matchEnded = true;
                        return;
                    }
                    return;
                });

                if (matchEnded) {
                    localStorage.clear();
                    alert("O jogo acabou");
                    location.reload();
                    return;
                }

                document.querySelectorAll(".gameSquare").forEach(function (gameSquare) {
                    gameSquare.removeEventListener("click", gameInnerWorkings);
                });

                const continueGameBtn = document.querySelector(".continueGameBtn");
                continueGameBtn.addEventListener("click", (ev) => {
                    restartRound(ev);
                });
                continueGameBtn.style.height = "40px";
                continueGameBtn.style.border = "2px solid black";

                document.getElementById("gameResult").innerText = "Vitória";

                restartGameStatus();
                saveGame();
            }
        });
    });
    if (playCount == 9) {
        document.getElementById("gameResult").innerText = "Deu velha!";
        document.querySelector(".player2Turn").classList.add("hidden");
        document.querySelector(".player1Turn").classList.add("hidden");
        const continueGameBtn = document.querySelector(".continueGameBtn");
        continueGameBtn.addEventListener("click", restartRound);
        continueGameBtn.style.height = "40px";
        continueGameBtn.style.border = "2px solid black";

        restartGameStatus();
        saveGame();
    }
}

function gameInnerWorkings(ev) {
    if (ev.currentTarget.dataset.selectedByPlayer == "") {
        let player1 = players[0];
        let player2 = players[1];

        const squareLocation = ev.currentTarget.dataset.region.split("-");
        const squareRow = squareLocation[0];
        const squareColumn = squareLocation[1];
        gameStatus[squareRow][squareColumn] = currentPlayer;

        if (currentPlayer == 1) {
            ev.currentTarget.innerText = player1.symbol;
            ev.currentTarget.dataset.selectedByPlayer = "1";
            ev.currentTarget.classList.add("player1Color");
            document.querySelector(".player2Turn").classList.remove("hidden");
            document.querySelector(".player1Turn").classList.add("hidden");
            playCount++;
            checkVitory();
        } else if (currentPlayer == 2) {
            ev.currentTarget.innerText = player2.symbol;
            ev.currentTarget.dataset.selectedByPlayer = "2";
            ev.currentTarget.classList.add("player2Color");
            document.querySelector(".player1Turn").classList.remove("hidden");
            document.querySelector(".player2Turn").classList.add("hidden");
            playCount++;
            checkVitory();
        }

        if (currentPlayer == 1) {
            currentPlayer = 2;
        } else if (currentPlayer == 2) {
            currentPlayer = 1;
        }

        console.table(gameStatus);
        saveGame();
    }
}

document.getElementById("startGameBtn").addEventListener("click", newGameHandler);
document.getElementById("restartRoundBtn").addEventListener("click", restartRound);
document.getElementById("resetLocal").addEventListener("click", (ev) => {
    ev.preventDefault();
    localStorage.clear();
    location.reload();
});
document.querySelectorAll(".gameSquare").forEach(function (gameSquare) {
    gameSquare.addEventListener("click", gameInnerWorkings);
});

restoreGame();
