const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
let grid = [];
let score = 0;

// Initialize the game
function init() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    scoreDisplay.innerText = score;
    addNewTile();
    addNewTile();
    drawGrid();
}

// Draw the grid
function drawGrid() {
    gridContainer.innerHTML = '';
    for (let row of grid) {
        for (let cell of row) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell', `cell-${cell}`);
            cellDiv.innerText = cell !== 0 ? cell : '';
            gridContainer.appendChild(cellDiv);
        }
    }
}

// Add a new tile (2 or 4)
function addNewTile() {
    let emptyCells = [];
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 0) emptyCells.push({ r, c });
        });
    });

    if (emptyCells.length) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Move tiles based on the direction
function moveTiles(direction) {
    let moved = false;

    const mergeRow = (row) => {
        let newRow = row.filter(cell => cell);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow.splice(i + 1, 1);
            }
        }
        return [...newRow, ...Array(4 - newRow.length).fill(0)];
    };

    if (direction === 'left') {
        grid = grid.map(row => mergeRow(row));
        moved = true;
    } else if (direction === 'right') {
        grid = grid.map(row => mergeRow(row.reverse()).reverse());
        moved = true;
    } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
            const column = grid.map(row => row[c]);
            const newColumn = mergeRow(column);
            for (let r = 0; r < 4; r++) {
                grid[r][c] = newColumn[r];
            }
        }
        moved = true;
    } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
            const column = grid.map(row => row[c]).reverse();
            const newColumn = mergeRow(column).reverse();
            for (let r = 0; r < 4; r++) {
                grid[r][c] = newColumn[r];
            }
        }
        moved = true;
    }

    if (moved) {
        addNewTile();
        drawGrid();
        scoreDisplay.innerText = score;

        // Display occupied tiles after the move
        displayOccupiedTiles();
    }
}

// Function to get occupied tiles
function getOccupiedTiles() {
    const occupiedTiles = [];
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                occupiedTiles.push({ value: cell, position: { row: r + 1, col: c + 1 } }); // Use 1-based index
            }
        });
    });
    return occupiedTiles;
}

// Function to display occupied tiles in the console
function displayOccupiedTiles() {
    const occupiedTiles = getOccupiedTiles();
    console.log("Occupied Tiles:");
    occupiedTiles.forEach(tile => {
        console.log(`Value: ${tile.value}, Position: (${tile.position.row}, ${tile.position.col})`);
    });
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveTiles('left');
    else if (event.key === 'ArrowRight') moveTiles('right');
    else if (event.key === 'ArrowUp') moveTiles('up');
    else if (event.key === 'ArrowDown') moveTiles('down');
});

// Restart the game
function restartGame() {
    init();
}

// Start the game
init();
