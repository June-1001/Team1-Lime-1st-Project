class Component {
    constructor(radius, color, x, y) { //원의 속성 선언 : 반지름, 색, x좌표, y좌표  
        this.radius = radius;   //여기서 this는 새로 생성되는 객체를 가리킴
        this.color = color;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    static getRandomPosition(canvas, radius, existingPieces) { //랜덤한 위치에 원을 생성하기위한 함수 , static 사용 = 인스턴스 없이 사용할 수 있어서 
        let x, y, valid;                                       //Component.getRandomPosition(. . .) 식으로 사용 가능

        do {
            x = Math.random() * (canvas.width - 2 * radius) + radius;
            y = Math.random() * (canvas.height - 2 * radius) + radius;

            valid = existingPieces.every(piece => {
                const dx = x - piece.x;
                const dy = y - piece.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance >= radius * 2.5;
            });
        } while (!valid);

        return { x, y };
    }
}

// 게임 관련 변수
var myGamePieces = [];

var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("click", handleClick);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// 게임 시작
function startGame() {
    myGamePieces = [];

    for (let i = 0; i < 6; i++) {
        let position = Component.getRandomPosition(myGameArea.canvas, 40, myGamePieces);
        myGamePieces.push(new Component(40, "#ff7777", position.x, position.y));
    }

    drawGamePieces();
}

// 게임 초기화
function clearGame() {
    myGamePieces = [];
    myGameArea.clear();
    document.getElementById("score").innerText = "Score: 0";
    gameTimer("off");
    return true;
}

// 클릭 처리
function handleClick(event) {
    const rect = myGameArea.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < myGamePieces.length; i++) {
        const piece = myGamePieces[i];
        const dx = mouseX - piece.x;
        const dy = mouseY - piece.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < piece.radius) {
            const pos = Component.getRandomPosition(myGameArea.canvas, 40, myGamePieces);
            myGamePieces[i] = new Component(40, "#ff7777", pos.x, pos.y);
            drawGamePieces();
            addScore();
            break;
        }
    }
}

// 점수 증가
function addScore() {
    const score = document.getElementById("score");
    const currentScore = parseInt(score.innerText.replace("Score: ", "")) || 0;
    score.innerText = "Score: " + (currentScore + 1);
}


// 원 그리기
function drawGamePieces() {
    myGameArea.clear();
    const ctx = myGameArea.context;

    myGamePieces.forEach(piece => piece.draw(ctx));
}

// 카운트다운 후 게임 시작
function startGameWithDelay() {
    const ctx = myGameArea.context;
    let count = 3;

    function updateCountdown() {
        myGameArea.clear();

        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(count, myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);

        if (count > 0) {
            count--;
            setTimeout(updateCountdown, 1000);
            score.innerText = "Score: 0";
            document.getElementById("timer").innerText = "Timer: 0";
        } else {
            myGameArea.clear();
            startGame();
            gameTimer("on");
        }
    }

    updateCountdown();
}

// 타이머
let intervalId = "";

function gameTimer(switchState) {
    const timerEl = document.getElementById("timer");

    if (switchState === "on") {
        let timeLeft = 10;
        timerEl.innerText = "Timer: " + timeLeft;

        intervalId = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerEl.innerText = "Timer: " + timeLeft;
            } else {
                clearInterval(intervalId);
                myGamePieces = [];
                timerEl.innerText = "Game Over";
                drawGamePieces();
            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        timerEl.innerText = "Timer: 0";
    }
}

// 시작
myGameArea.start();
