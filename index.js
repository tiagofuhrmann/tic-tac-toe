// *     ->        Realçar um quadrado ao passar o mouse em cima
// !     ->        Sistema de pontuação para cada jogador (melhor de 5)
// !     ->        Botão para resetar o round atual
// !     ->        Salvar o status atual no LocalStorage
// !     ->        Botão para continuar para o próximo round ao vencer ou empatar
// TODO  ->        Botão para resetar o jogo inteiro
// TODO  ->        Funcionamento do botão de alterar tema
// TODO  ->        Escurecer o resto dos campos quando tiver uma vitória

// Declaring main variables
// Declaring main variables
// Declaring main variables
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

let currentPlayer = "";
let winDirection;
let players = [
  { playerNumber: "1", symbol: "", name: "", wins: 0 },
  { playerNumber: "2", symbol: "", name: "", wins: 0 },
];
let playCount = 0;
let gameStatus = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

//Checking if saved game exists
//Checking if saved game exists
//Checking if saved game exists
retrieveGameData();

//Main Functions
//Main Functions
//Main Functions
function retrieveGameData() {
  let retrievedPlayers = localStorage.getItem("players");
  let retrievedPlayCount = localStorage.getItem("playCount");
  let retrievedCurrentPlayer = localStorage.getItem("currentPlayer");
  let retrievedGameStatus = localStorage.getItem("gameStatus");

  if (retrievedPlayers && retrievedPlayCount && retrievedCurrentPlayer && retrievedGameStatus) {
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
}

function checkVitory() {
  if (playCount < 9) {
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

          document.querySelector("#gameSquare-" + condition[0]).appendChild(hr1);
          document.querySelector("#gameSquare-" + condition[1]).appendChild(hr2);
          document.querySelector("#gameSquare-" + condition[2]).appendChild(hr3);

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

          for (i = 1; i <= players[playerWinner - 1].wins; i++) {
            let dot = document.getElementById(`player${playerWinner}-dot${i}`);
            dot.classList.add(`filledDotp${playerWinner}`);
          }

          document.querySelectorAll(".gameSquare").forEach(function (gameSquare) {
            gameSquare.removeEventListener("click", gameInnerWorkings);
          });

          const continueGameBtn = document.querySelector(".continueGameBtn");
          continueGameBtn.addEventListener("click", restartRound);
          continueGameBtn.style.height = "40px";
          continueGameBtn.style.border = "2px solid black";

          document.querySelector(".gameEnded").classList.remove("displayNone");
          document.querySelector(".gameEnded").innerText = "Vitória";

          gameStatus = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ];

          playCount = 0;

          localStorage.setItem("gameStatus", JSON.stringify(gameStatus));
          localStorage.setItem("currentPlayer", currentPlayer);
          localStorage.setItem("playCount", playCount);
          localStorage.setItem("players", JSON.stringify(players));
        }
      });
    });
  } else {
    document.querySelector(".gameEnded").classList.remove("displayNone");
    document.querySelector(".gameEnded").innerText = "Deu velha!";
    document.querySelector(".player2Turn").classList.add("hidden");
    document.querySelector(".player1Turn").classList.add("hidden");
    const continueGameBtn = document.querySelector(".continueGameBtn");
    continueGameBtn.addEventListener("click", restartRound);
    continueGameBtn.style.height = "40px";
    continueGameBtn.style.border = "2px solid black";

    gameStatus = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    playCount = 0;

    localStorage.setItem("gameStatus", JSON.stringify(gameStatus));
    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("playCount", playCount);
    localStorage.setItem("players", JSON.stringify(players));
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

    if (currentPlayer == "1") {
      ev.currentTarget.innerText = player1.symbol;
      ev.currentTarget.dataset.selectedByPlayer = "1";
      ev.currentTarget.classList.add("player1Color");
      document.querySelector(".player2Turn").classList.remove("hidden");
      document.querySelector(".player1Turn").classList.add("hidden");
      playCount++;
      checkVitory();
    } else if (currentPlayer == "2") {
      ev.currentTarget.innerText = player2.symbol;
      ev.currentTarget.dataset.selectedByPlayer = "2";
      ev.currentTarget.classList.add("player2Color");
      document.querySelector(".player1Turn").classList.remove("hidden");
      document.querySelector(".player2Turn").classList.add("hidden");
      playCount++;
      checkVitory();
    }

    if (currentPlayer == "1") {
      currentPlayer = "2";
    } else if (currentPlayer == "2") {
      currentPlayer = "1";
    }

    console.table(gameStatus);

    localStorage.setItem("playCount", playCount);
    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("gameStatus", JSON.stringify(gameStatus));
  }
}

function newGameHandler(ev) {
  ev.preventDefault();
  const nameInputsContainer = document.querySelector(".nameInputsContainer");

  ev.currentTarget.classList.add("displayNone");

  const li1 = document.createElement("li");
  const li2 = document.createElement("li");

  const label1 = createLabel("player1NameInput", "Jogador 1: ");
  const label2 = createLabel("player2NameInput", "Jogador 2: ");
  const labelX1 = createLabel("player1XInput", " X ");
  const labelX2 = createLabel("player2XInput", " X ");
  const labelO1 = createLabel("player1OInput", " O ");
  const labelO2 = createLabel("player2OInput", " O ");

  const input1 = createInput("player1NameInput", "player1NameInput", "PlayerNameInput", "text");
  const input2 = createInput("player2NameInput", "player2NameInput", "PlayerNameInput", "text");
  const inputX1 = createInput("player1XInput", "player1SymbolInput", "playerSymbolInput", "radio", "X");
  const inputX2 = createInput("player2XInput", "player2SymbolInput", "playerSymbolInput", "radio", "X");
  const inputO1 = createInput("player1OInput", "player1SymbolInput", "playerSymbolInput", "radio", "O");
  const inputO2 = createInput("player2OInput", "player2SymbolInput", "playerSymbolInput", "radio", "O");

  inputX1.addEventListener("click", function () {
    inputX2.checked = "false";
    inputO2.checked = "true";
  });
  inputO1.addEventListener("click", function () {
    inputO1.checked = "false";
    inputX2.checked = "true";
  });
  inputX2.addEventListener("click", function () {
    inputX1.checked = "false";
    inputO1.checked = "true";
  });
  inputO2.addEventListener("click", function () {
    inputO1.checked = "false";
    inputX1.checked = "true";
  });

  li1.append(label1, input1, labelX1, inputX1, labelO1, inputO1);
  li2.append(label2, input2, labelX2, inputX2, labelO2, inputO2);
  document.querySelector(".nameInputsList").append(li1, li2);

  const confirmStartBtn = document.createElement("button");
  confirmStartBtn.innerText = "Começar";

  confirmStartBtn.addEventListener("click", function () {
    if (input1.value && input2.value && document.querySelector("input[name='player1SymbolInput']:checked")) {
      currentPlayer = "1";
      players[0].name = input1.value;
      players[0].symbol = document.querySelector("input[name='player1SymbolInput']:checked").value;
      players[1].name = input2.value;
      players[1].symbol = document.querySelector("input[name='player2SymbolInput']:checked").value;
      document.querySelector(".player1Name").innerText = players[0].name;
      document.querySelector(".player2Name").innerText = players[1].name;
      document.querySelector(".player1Turn").classList.remove("hidden");
      localStorage.setItem("players", JSON.stringify(players));
      localStorage.setItem("currentPlayer", currentPlayer);
      localStorage.setItem("playCount", playCount);
      nameInputsContainer.style.height = "0px";
      nameInputsContainer.style.border = "0px";
      document.querySelector(".playerData").classList.remove("displayNone");
    } else {
      alert("Preencha os campos corretamente!");
    }
  });

  nameInputsContainer.append(confirmStartBtn);
  document.querySelector(".title").style.fontSize = "24px";
  nameInputsContainer.style.height = "270px";
  nameInputsContainer.style.border = "3px solid black";
}

function restartRound(ev) {
  ev.preventDefault();

  const continueGameBtn = document.querySelector(".continueGameBtn");
  continueGameBtn.removeEventListener("click", restartRound);
  continueGameBtn.style.height = "0px";
  continueGameBtn.style.border = "0px";

  playCount = 0;
  document.querySelector(".player1Turn").innerText = "Sua vez!";
  document.querySelector(".player2Turn").innerText = "Sua vez!";
  document.querySelector(".player1Turn").classList.add("hidden");
  document.querySelector(".player2Turn").classList.add("hidden");
  document.querySelectorAll(".gameSquare").forEach(function (square) {
    square.dataset.selectedByPlayer = "";
    square.innerText = "";
    square.addEventListener("click", gameInnerWorkings);
    square.classList.remove("player1Color");
    square.classList.remove("player2Color");
  });
  document.querySelector(".player1Info").classList.remove("displayNone");
  document.querySelector(".player2Info").classList.remove("displayNone");
  document.querySelector(".gameEnded").classList.add("displayNone");

  gameStatus = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  localStorage.setItem("gameStatus", JSON.stringify(gameStatus));
  localStorage.setItem("currentPlayer", currentPlayer);
  localStorage.setItem("playCount", playCount);
  localStorage.setItem("players", JSON.stringify(players));
}

// Accessory Functions
// Accessory Functions
// Accessory Functions
function createInput(id, name, className, type, value = "") {
  const input = document.createElement("input");
  input.id = id;
  input.name = name;
  input.className = className;
  input.type = type;
  input.value = value;
  return input;
}
function createLabel(htmlFor, innerText) {
  const label = document.createElement("label");
  label.htmlFor = htmlFor;
  label.innerText = innerText;
  return label;
}
function createHr(className) {
  let hr = document.createElement("hr");
  hr.className = className;
  return hr;
}

//Adding event listeners
//Adding event listeners
//Adding event listeners
document.getElementById("startGameBtn").addEventListener("click", newGameHandler);
document.querySelector(".restartRoundBtn").addEventListener("click", restartRound);
document.getElementById("resetLocal").addEventListener("click", (ev) => {
  ev.preventDefault();
  localStorage.clear();
  location.reload();
});
document.querySelectorAll(".gameSquare").forEach(function (gameSquare) {
  gameSquare.addEventListener("click", gameInnerWorkings);
});
