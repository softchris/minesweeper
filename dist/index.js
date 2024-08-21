class Game {
    constructor(canvasId, cellSize, gridSize, mineCount) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.grid = [];
        this.cellSize = cellSize;
        this.gridSize = gridSize;
        this.mineCount = mineCount;
        for (let x = 0; x < this.gridSize; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                this.grid[x][y] = {
                    mine: Math.random() < this.mineCount / (this.gridSize * this.gridSize),
                    revealed: false,
                    neighborMineCount: 0
                };
            }
        }
        this.calculateNeighborMines();
        this.draw();
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.handleRightClick.bind(this), false);
    }
    calculateNeighborMines() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && ny >= 0 && nx < this.gridSize && ny < this.gridSize && this.grid[nx][ny].mine) {
                            count++;
                        }
                    }
                }
                this.grid[x][y].neighborMineCount = count;
            }
        }
    }
    draw() {
        if (this.context === null || this.context === undefined) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const cell = this.grid[x][y];
                this.context.beginPath();
                this.context.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                this.context.stroke();
                if (!cell.revealed) {
                    const bevelSize = this.cellSize / 10; // Adjust this value to change the bevel size
                    // Draw top and left border for light effect
                    this.context.strokeStyle = 'white';
                    this.context.beginPath();
                    this.context.moveTo(x * this.cellSize + bevelSize, y * this.cellSize + this.cellSize);
                    this.context.lineTo(x * this.cellSize + bevelSize, y * this.cellSize + bevelSize);
                    this.context.lineTo(x * this.cellSize + this.cellSize, y * this.cellSize + bevelSize);
                    this.context.stroke();
                    // Draw bottom and right border for shadow effect
                    this.context.strokeStyle = 'black';
                    this.context.beginPath();
                    this.context.moveTo(x * this.cellSize + this.cellSize, y * this.cellSize + bevelSize);
                    this.context.lineTo(x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize - bevelSize);
                    this.context.lineTo(x * this.cellSize + bevelSize, y * this.cellSize + this.cellSize - bevelSize);
                    this.context.stroke();
                }
                if (cell.revealed) {
                    if (cell.mine) {
                        this.context.fillStyle = 'red';
                        this.context.fill();
                    }
                    else {
                        this.context.fillStyle = 'lightgrey';
                        this.context.fill();
                        let no = cell.neighborMineCount;
                        this.context.fillStyle = 'black';
                        this.context.font = '20px Arial'; // Set font size and family
                        this.context.textAlign = 'center';
                        this.context.textBaseline = 'middle';
                        if (no > 0) {
                            this.context.fillText(cell.neighborMineCount.toString(), x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2);
                        }
                    }
                }
                if (cell.flagged) {
                    // Draw pole
                    this.context.fillStyle = 'black';
                    this.context.fillRect(x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 4, this.cellSize / 10, this.cellSize / 2);
                    // Draw flag
                    this.context.beginPath();
                    this.context.moveTo(x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 4);
                    this.context.lineTo(x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2);
                    this.context.lineTo(x * this.cellSize + this.cellSize / 2 + this.cellSize / 4, y * this.cellSize + this.cellSize / 4 + this.cellSize / 8);
                    this.context.closePath();
                    this.context.fillStyle = 'red';
                    this.context.fill();
                }
            }
        }
    }
    resetGame() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                this.grid[x][y] = {
                    mine: Math.random() < this.mineCount / (this.gridSize * this.gridSize),
                    revealed: false,
                    neighborMineCount: 0
                };
            }
        }
        this.calculateNeighborMines();
        this.draw();
    }
    checkWin() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const cell = this.grid[x][y];
                if (!cell.mine && !cell.revealed) {
                    return false;
                }
            }
        }
        return true;
    }
    handleClick(event) {
        const x = Math.floor(event.clientX / this.cellSize);
        const y = Math.floor(event.clientY / this.cellSize);
        const cell = this.grid[x][y];
        if (cell.mine && !cell.revealed) {
            cell.revealed = true;
            this.draw();
            alert('You lost!');
            this.resetGame();
        }
        else {
            cell.revealed = true;
            this.draw();
            if (this.checkWin()) {
                alert('You won!');
                this.resetGame();
            }
        }
    }
    handleRightClick(event) {
        event.preventDefault();
        const x = Math.floor(event.clientX / this.cellSize);
        const y = Math.floor(event.clientY / this.cellSize);
        const cell = this.grid[x][y];
        if (!cell.revealed) {
            cell.flagged = !cell.flagged;
            this.draw();
        }
        return false;
    }
}
// Usage:
const game = new Game('game', 40, 20, 20);
export {};
