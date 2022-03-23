// Gameboard module
const gameboardModule = (function(){
    // Gameboard as private array
    let _gameboard = ["1","2","3","4","5","6","7","8", "9"];
    let setBoard = function(index, symbol){
        _gameboard[index]=symbol;
        displayControllerModule.paintGameboard();
    }
    let getBoard = function() {
        // Slice is here to return a copy instead of the private variable
        return _gameboard.slice(0);
    }
    return {setBoard, getBoard};
})()
    
    

// Player Factory
function PlayerFactory (name, symbol) {
    let makeMove = function(index){
        gameboardModule.setBoard(index, symbol);
    }
    return {name, makeMove};
}


// Display Controller module
const displayControllerModule = (function(){
    const gameboardCells = Array.from(document.querySelectorAll("[class^='cell']"));
    const paintGameboard = function(){
        for(let i = 0; i<gameboardModule.getBoard().length; i++){
            gameboardCells[i].textContent = gameboardModule.getBoard()[i];
        }
    }
    return {paintGameboard};
})()    

// Flow control


