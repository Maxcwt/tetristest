class Game {


    resetVars (){
        initialTwoDArr = [];
        for (let i = 0; i < squareCountY; i++) {
            let temp = [];
            for (let j = 0; j < squareCountX; j++) {
                temp.push({ imageX: -1, imageY: -1 });
            }
            initialTwoDArr.push(temp);
        }
        score = 0;
        gameOver = false;
        currentShape = getRandomShape();
        nextShape = getRandomShape();
        gameMap = initialTwoDArr;
        document.getElementById("playAgainButton").style.display = "none";
        document.getElementById("gameover").style.display = "none";
    };

    update() {
        if (gameOver) return;
        if (currentShape.checkBottom()) {
            document.getElementById("playAgainButton").style.display = "none";
            document.getElementById("gameover").style.display = "none";
            currentShape.y += 1;
        } else {
            for (let k = 0; k < currentShape.template.length; k++) {
                for (let l = 0; l < currentShape.template.length; l++) {
                    if (currentShape.template[k][l] == 0) continue;
                    gameMap[currentShape.getTruncedPosition().y + l][
                    currentShape.getTruncedPosition().x + k
                        ] = { imageX: currentShape.imageX, imageY: currentShape.imageY };
                }
            }

            deleteCompleteRows();
            currentShape = nextShape;
            nextShape = getRandomShape();
            if (!currentShape.checkBottom()) {
                gameOver = true;
            }
            score += 100;

        }
    };


    gameLoop () {
        setInterval(this.update, 1000 / gameSpeed);
        console.log("oui");
        setInterval(draw, 1000 / framePerSecond);
    };
}



const gameInstance = new Game();
gameInstance.gameLoop();
gameInstance.resetVars();