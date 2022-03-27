// Gameboard module
const gameboardModule = (function () {
  // Gameboard as private array
  let _gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  let _cellIsEditable = [true, true, true, true, true, true, true, true, true];
  const setBoard = function (index, symbol) {
    if (_cellIsEditable[index]) {
      _gameboard[index] = symbol;
      _cellIsEditable[index] = false;
    }
    displayControllerModule.paintGameboard();
  };
  const getBoard = function () {
    // Slice is here to return a copy instead of the private variable
    return _gameboard.slice(0);
  };
  const blockBoard = function () {
    for (let i = 0; i < _cellIsEditable.length; i++) {
      _cellIsEditable[i] = false;
    }
  };
  const isBlocked = function () {
    return _cellIsEditable.every((value) => value === false);
  };
  const resetBoard = function () {
    _gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    _cellIsEditable = [true, true, true, true, true, true, true, true, true];
  }
  // Function to check if a particular cell is editable
  const isEditable = function(i) {
    return _cellIsEditable[i];
  }
  return { setBoard, getBoard, blockBoard, isBlocked, resetBoard, isEditable };
})();

// Player Factory
function PlayerFactory(name, symbol) {
  let makeMove = function (index) {
    gameboardModule.setBoard(index, symbol);
    flowControlModule.checkForWin(this);
  };
  return { name, makeMove, symbol };
}

// Display Controller module
const displayControllerModule = (function () {
  const status = document.querySelector(".status");
  const gameboardCells = Array.from(
    document.querySelectorAll("[class^='cell']")
  );
  const paintGameboard = function () {
    for (let i = 0; i < gameboardModule.getBoard().length; i++) {
      gameboardCells[i].textContent = gameboardModule.getBoard()[i];
    }

  };
  const displayStatus = function(msg){
    status.textContent=(msg);
  }
  const paintWin = function(a,b,c){
    gameboardCells[a].classList.add("win");
    gameboardCells[b].classList.add("win");
    gameboardCells[c].classList.add("win");
  }
  const resetWin = function () {
    for(let i=0; i<gameboardCells.length; i++){
      gameboardCells[i].classList.remove("win");
    }
  }

  return { paintGameboard, displayStatus, paintWin, resetWin };
})();

// Flow control module
const flowControlModule = (function () {
  // Create Players
  let player1; 
  let player2;
  // For switching between them
  let activePlayer;
  let togglePlayerFlag; 
  let AIactive = false;
  let gameOver=false;

  // Add event listener to new game button
  const newGameBtn=document.querySelector(".new-game");
  newGameBtn.addEventListener("click", _startNewGame);

  // Add event listener to AI button
  const enableAI=document.querySelector(".enable-AI");
  enableAI.addEventListener("click", _startNewGameAgainstAI);

  // Start new game
  function _startNewGame(){
    AIactive=false;
    gameboardModule.resetBoard();
    displayControllerModule.paintGameboard();
    initializeGame(prompt("name1 for X"), prompt("name2 for O"));
    displayControllerModule.displayStatus(`${activePlayer.name}'s turn`);
  }

    // Start new game against AI
    function _startNewGameAgainstAI(){
      AIactive=true;
      gameboardModule.resetBoard();
      displayControllerModule.paintGameboard();
      initializeGame(prompt("name1 for X"), "Computer");
      displayControllerModule.displayStatus(`${activePlayer.name}'s turn`);
    }

  function initializeGame(name1, name2) {
    // Initialize the players
    player1=PlayerFactory(name1, "X");
    player2 = PlayerFactory(name2, "O");
    activePlayer=player1;
    togglePlayerFlag = true;
    // Add Event Listeners
    const gameboardCells = Array.from(
      document.querySelectorAll("[class^='cell']")
    );
    for (let i = 0; i < gameboardCells.length; i++) {
      if(AIactive){
        gameboardCells[i].addEventListener("click", _addClickListenersAI);
      } else {
        // Remove the AI click listeners should there be any
        gameboardCells[i].removeEventListener("click", _addClickListenersAI)
        gameboardCells[i].addEventListener("click", _addClickListeners);
      }
    }
  }

  // Event Listener Function for Gameboard Cells
  function _addClickListeners(event) {
    // Get the number of the cell clicked on
    let index = event.currentTarget.classList.item(0).substring(4) - 1;
    if (togglePlayerFlag) {
      activePlayer = player1;
      displayControllerModule.displayStatus(`${player2.name}'s turn`);
    } else {
      activePlayer = player2;
      displayControllerModule.displayStatus(`${player1.name}'s turn`);
    }
    activePlayer.makeMove(index);
    togglePlayerFlag = !togglePlayerFlag;
  }

  // Event Listener Function for Gameboard Cells
  function _addClickListenersAI(event) {
    // Get the number of the cell clicked on
    let index = event.currentTarget.classList.item(0).substring(4) - 1;
    player1.makeMove(index);
    // Computer makes a move after the player if the game is not won by the last move
    if(!gameOver){
      let computedIndex = AiModule.computeIndex();
      player2.makeMove(computedIndex);
    } else {
      gameOver=!gameOver;
    }
  }

  // Check if a player won
  function checkForWin(player) {
    let currentBoard = gameboardModule.getBoard();
    let winner;
    switch (player.symbol.repeat(3)) {
      // Horizontal
      case currentBoard.join("").substring(0, 3):
      case currentBoard.join("").substring(3, 6):
      case currentBoard.join("").substring(6, 9):
      // Vertical
      case currentBoard[0] + currentBoard[3] + currentBoard[6]:
      case currentBoard[1] + currentBoard[4] + currentBoard[7]:
      case currentBoard[2] + currentBoard[5] + currentBoard[8]:
      // Diagonal
      case currentBoard[0] + currentBoard[4] + currentBoard[8]:
      case currentBoard[2] + currentBoard[4] + currentBoard[6]:
        winner = player.symbol;
        gameOver=true;
        _stopGame(player.name+" with "+player.symbol + " wins! 👑");
        return;
    }
    // Check if all fields have already been blocked
    if (winner == null) {
      if (gameboardModule.isBlocked()) {
        _stopGame("Tie!");
      }
    }
  }

  // Function to block the board if the game is over
  function _stopGame(msg) {
    gameboardModule.blockBoard();
    const gameboardCells = Array.from(
      document.querySelectorAll("[class^='cell']")
    );
    for (let i = 0; i < gameboardCells.length; i++) {
      gameboardCells[i].removeEventListener("click", _addClickListeners);
    }
    displayControllerModule.displayStatus(msg);
  }

  const infoBtn=document.querySelector(".btn-warning");
  infoBtn.addEventListener("click", () => {
    document.querySelector(".btn-primary").classList.toggle("invisible");
    console.log(document.querySelector(".btn-primary").classList);
  })
  return { initializeGame, checkForWin };
})();

const AiModule = (function(){
  const computeIndex = function(){
    let currentBoard = gameboardModule.getBoard();
    for(let i = 0; i < currentBoard.length; i++){
      if(gameboardModule.isEditable(i)){
        return i;
      }
    }
  }
  
  const computeSmartIndex = function(){
    // Try to get one of the winning combinations down
    if(gameboardModule.isEditable(0)){
      return 0;
    }
    if(gameboardModule.isEditable(1)){
      return 1;
    }
    if(gameboardModule.isEditable(2)){
      return 2;
    }
  }
  return {computeIndex, computeSmartIndex};
})()

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
