let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.scale(20, 20);

let grid = []
const initGrid = () => {
    grid = new Array(18);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(10).fill(0);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let block = {}
const createBlock = () => {
    random_int = getRandomInt(7);
    let matrix = [[]];
    if (random_int === 0) {
        matrix = [
            [1, 1, 1],
            [1, 0, 0],
            [0, 0, 0]
        ]
    } else if (random_int === 1) {
        matrix = [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    } else if (random_int === 2) {
        matrix = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]
        ]
    } else if (random_int === 3) {
        matrix = [
            [1, 1],
            [1, 1]
        ]
    } else if (random_int === 4) {
        matrix = [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    } else if (random_int === 5) {
        matrix = [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ]
    } else if (random_int === 6) {
        matrix = [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    }

    block = {
        x: 3, y: 0,
        matrix: matrix
    };
}

const drawBlock = () => {
    block.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(block.x + x, block.y + y, 1, 1);
            }
        });
    });
}

const drawGrid = () => {
    grid.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });
}

let prev_time = 0;
const update = (curr_time) => {
    let time_diff = curr_time - prev_time;
    document.getElementById("score").innerHTML = score;
    if (time_diff >= 1000) {
        block.y++;
        if (collision()) {
            block.y--;
            if (block.y <= 0) {
                console.log("game over!");
                score = 0;
                initGrid();
                createBlock();
            } else {
                saveBlockToGrid();
                clearLines();
                createBlock();
            }
        }

        prev_time = curr_time;
    }

    clear();
    drawBlock();
    drawGrid();
    requestAnimationFrame(update);
}

const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const saveBlockToGrid = () => {
    console.log(grid);
    block.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val === 1) {
                grid[y + block.y][x + block.x] = 1;
            }
        });
    });
}

const collision = () => {
    for (let y = 0; y < block.matrix.length; y++) {
        for (let x = 0; x < block.matrix.length; x++) {
            if (block.matrix[y][x] === 1) {
                if (y + block.y >= 18 ||
                    x + block.x >= 10 ||
                    x + block.x < 0 ||
                    grid[y + block.y][x + block.x] === 1) {
                    return true;
                }
            }
        }
    }
    return false;
}

document.addEventListener("keydown", (ev) => {
    if (ev.key == "ArrowDown") {
        block.y++;
        if (collision()) {
            block.y--;
        }
    } else if (ev.key == "ArrowLeft") {
        block.x--;
        if (collision()) {
            block.x++;
        }
    } else if (ev.key == "ArrowRight") {
        block.x++;
        if (collision()) {
            block.x--;
        }
    } else if (ev.key == "ArrowUp") {
        rotateClockwise();
        if (collision()) {
            rotateCounterClockwise();
        }
    }
});

const rotateClockwise = () => {
    block.matrix = reverse(transpose(block.matrix));
}

const rotateCounterClockwise = () => {
    block.matrix = transpose(reverse(block.matrix));
}

const clearLines = () => {
    rows = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].includes(0)) {
            continue;
        } else {
            rows.push(i);
        }
    }

    for (let i = 0; i < rows.length; i++) {
        grid.splice(rows[i] - i, 1);
        score += 100;
    }

    for (let i = 0; i < rows.length; i++) {
        grid.splice(i, 0, new Array(10).fill(0));
    }

}

const transpose = matrix => {
    for (let row = 0; row < matrix.length; row++) {
        for (let column = 0; column < row; column++) {
            let temp = matrix[row][column]
            matrix[row][column] = matrix[column][row]
            matrix[column][row] = temp
        }
    }
    return matrix;
}

const reverse = matrix => matrix.map(row => row.reverse());

let score = 0;
initGrid();
clear();
createBlock();
update();