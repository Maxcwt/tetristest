class Drawing {
    constructor(imageX, imageY, template) {
        this.imageY = imageY;
        this.imageX = imageX;
        this.template = template;
        this.x = squareCountX / 2.8;
        this.y = 0;

    }

    checkBottom() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realY + 1 >= squareCountY) {
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    getTruncedPosition() {
        return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
    }
    checkLeft() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] === 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX - 1 < 0) {
                    return false;
                }

                if (gameMap[realY][realX - 1].imageX !== -1) return false;
            }
        }
        return true;
    }

    checkRight() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX + 1 >= squareCountX) {
                    return false;
                }

                if (gameMap[realY][realX + 1].imageX != -1) return false;
            }
        }
        return true;
    }

    moveRight() {
        if (this.checkRight()) {
            this.x += 1;
        }
    }

    moveLeft() {
        if (this.checkLeft()) {
            this.x -= 1;
        }
    }

    moveBottom() {
        if (this.checkBottom()) {
            this.y += 1;
            score += 1;
        }
    }
    changeRotation() {
        let tempTemplate = [];
        for (let i = 0; i < this.template.length; i++)
            tempTemplate[i] = this.template[i].slice();
        let n = this.template.length;
        for (let layer = 0; layer < n / 2; layer++) {
            let first = layer;
            let last = n - 1 - layer;
            for (let i = first; i < last; i++) {
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[last - offset][first]; // Correction
                this.template[last - offset][first] = this.template[last][last - offset];
                this.template[last][last - offset] = this.template[i][last];
                this.template[i][last] = top;
            }
        }

        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template[i].length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = j + this.getTruncedPosition().x;
                let realY = i + this.getTruncedPosition().y;
                if (
                    realX < 0 ||
                    realX >= squareCountX ||
                    realY < 0 ||
                    realY >= squareCountY
                ) {
                    this.template = tempTemplate;
                    return false;
                }
            }
        }
    }
}
let deleteCompleteRows =  () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        let isComplete = true;
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) isComplete = false;
        }
        if (isComplete) {
            console.log("complete row");
            score += 1000;
            for (let k = i; k > 0; k--) {
                gameMap[k] = gameMap[k - 1];
            }
            let temp = [];
            for (let j = 0; j < squareCountX; j++) {
                temp.push({ imageX: -1, imageY: -1 });
            }
            gameMap[0] = temp;
        }
    }
};
let drawRect = (x, y, width, height, color)  => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

let drawBackground   = () => {
    drawRect(0, 0, canvas.width, canvas.height, "#cecece");
    for (let i = 0; i < squareCountX + 1; i++) {
        drawRect(
            size * i - whiteLineThickness,
            0,
            whiteLineThickness,
            canvas.height,
            "#ece9e9"
        );
    }

    for (let i = 0; i < squareCountY + 1; i++) {
        drawRect(
            0,
            size * i - whiteLineThickness,
            canvas.width,
            whiteLineThickness,
            "#ece9e9"
        );
    }
};

let drawCurrentTetris = () =>{
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x) * size + size * i,
                Math.trunc(currentShape.y) * size + size * j,
                size,
                size
            );
        }
    }
};

let drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) continue;
            ctx.drawImage(
                image,
                t[j].imageX,
                t[j].imageY,
                imageSquareSize,
                imageSquareSize,
                j * size,
                i * size,
                size,
                size
            );
        }
    }
};

let drawNextShape = () =>{
    nctx.fillStyle = "#040F2D";
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let i = 0; i < nextShape.template.length; i++) {
        for (let j = 0; j < nextShape.template.length; j++) {
            if (nextShape.template[i][j] == 0) continue;
            nctx.drawImage(
                image,
                nextShape.imageX,
                nextShape.imageY,
                imageSquareSize,
                imageSquareSize,
                size * i,
                size * j + size,
                size,
                size
            );
        }
    }
};

let drawScore = () => {
    sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    sctx.font = "64px Poppins";
    sctx.fillStyle = "white";
    sctx.fillText(score, 10, 50);
    if(score !== 0 ) {
        if (score <=10000){
            let speed = score/1000;
        }
        else if (score > 10000){
            let speed = score / 10000;
            if (speed <= 16)
                musique.playbackRate = speed;
            else if (speed > 16)
                musique.playbackRate = 16;}

    }
    else
        musique.playbackRate=1;
};
let drawGameOver = () => {
    document.getElementById("gameover").style.display ="block";
    document.getElementById("playAgainButton").style.display = "block";
};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSquares();
    drawCurrentTetris();
    drawNextShape();
    drawScore();
    if (gameOver) {
        drawGameOver();
    }
};

let getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

const shapes = [
    new Drawing(0, 120, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]),
    new Drawing(0, 96, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Drawing(0, 72, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
    new Drawing(0, 48, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]),
    new Drawing(0, 24, [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]),
    new Drawing(0, 0, [
        [1, 1],
        [1, 1],
    ]),

    new Drawing(0, 48, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),
];


window.addEventListener("keydown", (event) => {
    if (event.keyCode == 37 && gameOver == false) currentShape.moveLeft();
    else if (event.keyCode == 38 && gameOver == false) currentShape.changeRotation();
    else if (event.keyCode == 39 && gameOver == false) currentShape.moveRight();
    else if (event.keyCode == 40 && gameOver == false) currentShape.moveBottom();
});