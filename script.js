// Initialize the chessboard
var board = Chessboard('board', {
    draggable: false,
    position: 'start',
    pieceTheme: 'chessboard_js/img/chesspieces/wikipedia/{piece}.png' 
});

// Initialize the game
var game = new Chess();
var moves = [];
var currentMoveIndex = 0;

// Load PGN and initialize moves
document.getElementById('loadGame').addEventListener('click', function() {
    var pgn = document.getElementById('pgnInput').value.trim();

    if (pgn === "") {
        alert("Please enter a PGN before loading.");
        return;
    }

    game.reset();

    if (!game.load_pgn(pgn)) {
        alert("Invalid PGN. Please check your input.");
        return;
    }

    // Store move history
    moves = game.history({ verbose: true });
    currentMoveIndex = 0;
    board.position('start');

    console.log("Game Loaded. Moves:", moves);
});

// Move forward (Next Move)
document.getElementById('nextMove').addEventListener('click', function() {
    if (currentMoveIndex < moves.length) {
        game.move(moves[currentMoveIndex]);
        board.position(game.fen());
        currentMoveIndex++;

        console.log("Moved Forward:", moves[currentMoveIndex - 1]);
    }
});

// Move backward (Previous Move)
document.getElementById('prevMove').addEventListener('click', function() {
    if (currentMoveIndex > 0) {
        game.undo();
        currentMoveIndex--;
        board.position(game.fen());

        console.log("Moved Back:", moves[currentMoveIndex]);
    }
});
