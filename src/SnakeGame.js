import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const cellWH = 25;
const gameWH = 500;
var mainDiv = {
    width: 500 + "px"
}

export default class SnakeGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 'relative',
            width: gameWH + "px",
            height: gameWH + "px",
            background: "lightgray"
        }
    }

    componentDidMount() {
        //score variables
        var score = 0,
            scoreElement = document.getElementById('playerScore');

        var prey;
        var snake;
        var timer;
        var isPaused = true;
        var fin = false;
        var btn = document.getElementById('startPause'); //keypress

        var inputRecieved = false;
        var direction = 'right';

        document.body.onkeydown = function (e) {
            if (!inputRecieved) {
                if (e.keyCode === 38 && direction !== 'down') {
                    direction = 'up';
                    inputRecieved = true;
                } else if (e.keyCode === 39 && direction !== 'left') {
                    direction = 'right';
                    inputRecieved = true;
                } else if (e.keyCode === 40 && direction !== 'up') {
                    direction = 'down';
                    inputRecieved = true;
                } else if (e.keyCode === 37 && direction !== 'right') {
                    direction = 'left';
                    inputRecieved = true;
                }
            }

            // if (e.keyCode === 80) {
            //     pause();
            // }
        };

        //main component
        function Cell(x, y, color) {
            this.x = x;
            this.y = y;
            this.cellDivStyle = {
                position: 'absolute',
                left: this.x * cellWH + 'px',
                top: this.y * cellWH + 'px',
                width: cellWH,
                height: cellWH,
                background: color
            };
            this.render = function () {
                return (<div key={Math.random()} style={this.cellDivStyle}></div>);
            }
        }

        //generate valid x and y coordinates
        function randVal() {
            //worry about initial position -- fixed
            return Math.floor(Math.random() * (gameWH / cellWH));
        }

        // //copied from stack overflow
        // function getRandomColor() {
        //     var letters = '0123456789ABCDEF';
        //     var color = '#';
        //     for (var i = 0; i < 6; i++) {
        //         color += letters[Math.floor(Math.random() * 16)];
        //     }
        //     return color;
        // }
        //snake color pattern

        var colorPattern = ['white', 'black', '#d15d1b', '#d15d1b', '#d15d1b', '#d15d1b', '#d15d1b', 'black'];

        function getCurrentColor() {
            return colorPattern[currentColorIndex = currentColorIndex + 1 > 7 ? 0 : ++currentColorIndex];
        }

        function createPrey() {
            prey = new Cell(randVal(), randVal(), 'darkolivegreen');
        } //CREATE snake

        var currentColorIndex = 0;
        function createSnake() {
            snake = [];

            for (var i = 2; i >= 0; i--) {
                snake.push(new Cell(i, 0, '#7ae6e8'));
            }
        } ///move

        function move() {
            //snake.pop();
            var temp = snake.pop();

            if (direction === 'right') {
                temp = new Cell(snake[0].x + 1, snake[0].y, temp.cellDivStyle.background);
            } else if (direction === 'left') {
                temp = new Cell(snake[0].x - 1, snake[0].y, temp.cellDivStyle.background);
            } else if (direction === 'up') {
                temp = new Cell(snake[0].x, snake[0].y - 1, temp.cellDivStyle.background);
            } else if (direction === 'down') {
                temp = new Cell(snake[0].x, snake[0].y + 1, temp.cellDivStyle.background);
            }

            snake.unshift(temp);
            collisionCheck(snake[0]);
            kill();
        }

        function kill() {
            if (prey.x === snake[0].x && prey.y === snake[0].y) {
                snake.push(new Cell(prey.x, prey.y, prey.cellDivStyle.background));
                prey = new Cell(randVal(), randVal(), 'darkolivegreen');

                //update scroe
                score++;
                scoreElement.innerText = score;
            } else {
                var temp = snake.slice(1);

                if (temp.some(function (t) {
                    return t.x === prey.x && t.y === prey.y;
                })) {
                    prey = new Cell(randVal(), randVal(), 'darkolivegreen');
                }
            }
        } //boundaries


        function collisionCheck(c) {
            var limit = gameWH / cellWH - 1;

            if (c.x < 0 || c.y < 0 || c.x > limit || c.y > limit) {
                endGame();
            }

            var temp = snake.slice(1);
            temp.forEach(function (c) {
                if (snake[0].x === c.x && snake[0].y === c.y) {
                    //snake[0].cellDivStyle.background = 'black';
                    endGame();
                }
            });
        }

        function pause() {
            if (!fin) {
                if (!isPaused) {
                    btn.innerText = "Resume";
                    clearInterval(timer);
                } else {
                    btn.innerText = "Pause";
                    timer = setInterval(run, 150);
                }

                isPaused = !isPaused;
            }
        }

        function endGame() {
            fin = true;
            clearInterval(timer);
            btn.innerText = "Start";
            btn.onclick = startGame;
        }

        function startGame() {
            //SETUP VAR
            inputRecieved = false;
            direction = 'right';
            isPaused = true;
            fin = false; //setup button

            btn.innerText = "Pause";
            btn.onclick = pause;
            isPaused = false;
            createSnake();
            createPrey();
            clearInterval(timer);
            timer = setInterval(run, 150);
        }

        btn.innerText = "Start";
        btn.onclick = startGame; ///render

        function run() {
            //enable input
            inputRecieved = false;
            move();
            var allCells = [];
            allCells.push(prey.render()); //correct color

            currentColorIndex = 0;
            snake.forEach(function (c) {
                allCells.push(new Cell(c.x, c.y, getCurrentColor()).render());
            });
            ReactDOM.render(
                allCells,
                document.getElementById('stage')
            );
            allCells = 0;

        } //let timer = setInterval(run, 150);

    }

    render() {
        return (
            <div className="container" style={mainDiv}>
                <div className="row">
                    <div>
                        <button id="startPause" className="btn btn-secondary">Start</button>
                    </div>
                </div>

                <br />

                <div className="row">
                    <div id="stage" style={this.state}></div>
                </div>
            </ div >
        );
    }
}