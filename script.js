const backendURL = "https://chess-flask-backend-rqbp.onrender.com";

function sendRawPGN() {
    var pgn = document.getElementById('pgnInput').value.trim();

    if (pgn === "") {
        alert("Please enter a PGN before sending.");
        return;
    }

    // Send the raw PGN to the backend
    fetch("https://chess-flask-backend-rqbp.onrender.com/upload_pgn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pgn: pgn })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error from backend:", data.error);
        } else {
            console.log("Raw PGN sent successfully.");
            console.log("Response from backend:", data);
            console.log("Predicted Elo ratings:");
            console.log("White Elo:", data.white_elo);
            console.log("Black Elo:", data.black_elo);

            // Update the results section with Elo ratings
            document.getElementById('eloResults').textContent = 
                "White Elo: " + data.white_elo + " | Black Elo: " + data.black_elo;
        }
    })
    .catch(error => {
        console.error("Error sending PGN:", error);
    });
}


function extractMovesFromPGN(pgn) {
    // Remove metadata (lines starting with '[')
    pgn = pgn.replace(/\[.*?\]\s*/g, '');

    // Remove move numbers and results (e.g., "1.", "1-0", "1/2-1/2")
    pgn = pgn.replace(/\d+\.+|\d+\s*-\s*\d+|\d+\/\d+-\d+\/\d+/g, '');

    // Remove extra spaces and newlines
    pgn = pgn.replace(/\s+/g, ' ').trim();

    return pgn;
}

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

    var cleanedPGN = extractMovesFromPGN(pgn);

    // Reset the game and load the PGN
    game.reset();
    if (!game.load_pgn(cleanedPGN)) {
        alert("Invalid PGN. Please check your input.");
        return;
    }

    // Store move history from the loaded PGN
    moves = game.history({ verbose: true });

    // Format moves with move numbers
    let formattedMoves = '';
    for (let i = 0; i < moves.length; i++) {
        if (i % 2 === 0) {
            formattedMoves += `${Math.floor(i / 2) + 1}. `; // Add move number
        }
        formattedMoves += moves[i].san + ' '; // Add move notation
    }
    // Display the formatted moves
    document.getElementById('cleanedPGNDisplay').textContent = "Game loaded successfully.\n\n " + formattedMoves;

    // Reset the game to the starting position so we can replay moves step-by-step
    game.reset();
    currentMoveIndex = 0;
    board.position(game.fen());
});

document.getElementById('sendPGN').addEventListener('click', sendRawPGN);


// Move forward (Next Move)
document.getElementById('nextMove').addEventListener('click', function() {
    if (currentMoveIndex < moves.length) {
        let move = moves[currentMoveIndex];  // Get the next move object
        let result = game.move(move.san);  // Apply move in SAN format
        if (!result) {
            return;
        }
        board.position(game.fen());  // Update board position
        currentMoveIndex++;
    }
});

// Move backward (Previous Move)
document.getElementById('prevMove').addEventListener('click', function() {
    if (currentMoveIndex > 0) {
        game.undo();  // Undo last move
        currentMoveIndex--;
        board.position(game.fen());  // Update board position
    }
});

