// Gameboard module
const gameboardModule = (function () {
  // Gameboard as private array
  let _gameboard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let _cellIsEditable = [true, true, true, true, true, true, true, true, true];
  let setBoard = function (index, symbol) {
    if (_cellIsEditable[index]) {
      _gameboard[index] = symbol;
      _cellIsEditable[index] = false;
    }
    displayControllerModule.paintGameboard();
  };
  let getBoard = function () {
    // Slice is here to return a copy instead of the private variable
    return _gameboard.slice(0);
  };
  let blockBoard = function () {
    for (let i = 0; i < _cellIsEditable.length; i++) {
      _cellIsEditable[i] = false;
    }
  };
  let isBlocked = function () {
    return _cellIsEditable.every((value) => value === false);
  };

  return { setBoard, getBoard, blockBoard, isBlocked };
})();

// Player Factory
function PlayerFactory(name, symbol) {
  let makeMove = function (index) {
    gameboardModule.setBoard(index, symbol);
    flowControlModule.checkForWin(symbol);
  };
  return { name, makeMove };
}

// Display Controller module
const displayControllerModule = (function () {
  const gameboardCells = Array.from(
    document.querySelectorAll("[class^='cell']")
  );
  const paintGameboard = function () {
    for (let i = 0; i < gameboardModule.getBoard().length; i++) {
      gameboardCells[i].textContent = gameboardModule.getBoard()[i];
    }
  };
  return { paintGameboard };
})();

// Flow control module
const flowControlModule = (function () {
  function initializeGame() {
    const gameboardCells = Array.from(
      document.querySelectorAll("[class^='cell']")
    );
    for (let i = 0; i < gameboardCells.length; i++) {
      gameboardCells[i].addEventListener("click", addClickListeners);
    }
  }
  // Event Listener Function
  function addClickListeners(event) {
    // Create Players
    const player1 = PlayerFactory("Peter", "X");
    const player2 = PlayerFactory("Brian", "O");
    let activePlayer;
    let togglePlayerFlag = true;
    let index = event.currentTarget.classList.item(0).substring(4) - 1;
    if (togglePlayerFlag) {
      activePlayer = player1;
    } else {
      activePlayer = player2;
    }
    activePlayer.makeMove(index);
    togglePlayerFlag = !togglePlayerFlag;
  }
  function checkForWin(symbol) {
    let currentBoard = gameboardModule.getBoard();
    let winner;
    switch (symbol.repeat(3)) {
      // Horizontal
      case currentBoard.join("").substring(0, 3):
      case currentBoard.join("").substring(3, 6):
      case currentBoard.join("").substring(6):
      // Vertical
      case currentBoard[0] + currentBoard[3] + currentBoard[6]:
      case currentBoard[1] + currentBoard[4] + currentBoard[7]:
      case currentBoard[2] + currentBoard[5] + currentBoard[8]:
      // Diagonal
      case currentBoard[0] + currentBoard[4] + currentBoard[8]:
      case currentBoard[2] + currentBoard[4] + currentBoard[6]:
        winner = symbol;
        _stopGame(symbol + " wins!");
        return;
    }
    // Check if all fields have already been blocked
    if (winner == null) {
      if (gameboardModule.isBlocked()) {
        _stopGame("Tie!");
      }
    }
  }

  function _stopGame(msg) {
    gameboardModule.blockBoard();
    console.log(msg);
    const gameboardCells = Array.from(
      document.querySelectorAll("[class^='cell']")
    );
    for (let i = 0; i < gameboardCells.length; i++) {
      gameboardCells[i].removeEventListener("click", addClickListeners);
    }
  }

  return { initializeGame, checkForWin };
})();

flowControlModule.initializeGame();

/* W I N N I N G   C O M B I N A T I O N S
horizontal
X X X 4 5 6 7 8 9
1 2 3 X X X 7 8 9
1 2 3 4 5 6 X X X
vertical
X 2 3 X 5 6 X 8 9
1 X 3 4 X 5 7 X 9
1 2 X 4 5 X 7 8 X
diagonal
X 2 3 4 X 6 7 8 X
1 2 X 4 X 6 X 8 9
*/
