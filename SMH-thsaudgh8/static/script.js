//게임 공간 생성, 게임 오브젝트 선언, 게임 에리어의 속성 넣어주기 
var myGamePieces = [];
var score = document.getElementById("score");
var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");

        // 캔버스 클릭 이벤트 추가
        this.canvas.addEventListener("click", handleClick);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// 게임 시작 (원 생성)
function startGame() {
    myGamePieces = [];

    for (let i = 0; i < 6; i++) {
        let position = getRandomPosition();
        myGamePieces.push(new component(40, "#ff7777", position.x, position.y));
    }

    drawGamePieces();
}

function clearGame() {
    myGamePieces = [];  // 원 리스트 비우기
    myGameArea.clear(); // 캔버스 지우기
    score.innerText = "Score: 0"; // 점수를 0으로 설정
    gameTimer("off");
    return true;
}

// 원 클릭 시 삭제 후 재생성
function handleClick(event) {
    var rect = myGameArea.canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    //클릭된 원이 있는지 확인하기(for문)
    for (let i = 0; i < myGamePieces.length; i++) {
        let piece = myGamePieces[i];

        // 클릭된 좌표와 원의 중심 간의 거리 계산
        let dx = mouseX - piece.x;
        let dy = mouseY - piece.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        //원의 반지름보다 클릭한 거리가 더 작으면 원의 내부임
        if (distance < piece.radius) {
            //랜덤한 위치에 원을 이동시킴
            let newPosition = getRandomPosition();
            myGamePieces[i] = new component(40, "#ff7777", newPosition.x, newPosition.y);

            //변경 위치에 원 다시그리고 점수 증가
            drawGamePieces();
            addScore();
            break;
        }
    }
}

function addScore() {
    // 현재 점수 가져오기
    let currentScore = parseInt(score.innerText.replace("Score: ", "")) || 0;

    // 점수 증가 후 업데이트
    score.innerText = "Score: " + (currentScore + 1);
}

// 원을 화면에 그리는 함수
function drawGamePieces() {
    myGameArea.clear();
    let ctx = myGameArea.context;

    for (let piece of myGamePieces) {
        ctx.fillStyle = piece.color;
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, piece.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// 원끼리 겹치지 않도록 랜덤 위치 생성
function getRandomPosition() {
    let x, y, valid;
    let radius = 40;

    do {
        x = Math.random() * (myGameArea.canvas.width - 2 * radius) + radius;
        y = Math.random() * (myGameArea.canvas.height - 2 * radius) + radius;

        valid = myGamePieces.every(piece => {
            let dx = x - piece.x;
            let dy = y - piece.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            return distance >= radius * 2.5;
        });
    } while (!valid);

    return { x, y };
}

function component(radius, color, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}

function startGameWithDelay() {
    let ctx = myGameArea.context; // 캔버스 컨텍스트 가져오기
    let count = 3; // 시작 숫자

    function updateCountdown() {
        myGameArea.clear(); // 캔버스 초기화

        // 카운트다운 텍스트 스타일 설정
        ctx.fillStyle = "#000"; // 글자 색상
        ctx.font = "48px Arial"; // 글자 스타일
        ctx.textAlign = "center"; // 중앙 정렬
        ctx.fillText(count, myGameArea.canvas.width / 2, myGameArea.canvas.height / 2); // 캔버스 중앙에 출력

        if (count > 0) {
            count--; // 숫자 감소
            setTimeout(updateCountdown, 1000); // 1초 후 다시 실행
            score.innerText = "Score: 0";
            document.getElementById("timer").innerText = "Timer: 0";
        } else {
            myGameArea.clear(); // 카운트다운 종료 후 캔버스 정리
            startGame(); // 게임 시작
            gameTimer("on");
        }
    }
    updateCountdown(); // 카운트다운 시작
}

let intervalId = ""; // 인터벌 ID를 저장할 변수

function gameTimer(switchState) {
    const timerEl = document.getElementById("timer");

    if (switchState == "on") {
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
    } else if (switchState == "off") {
        clearInterval(intervalId);
        timerEl.innerText = "Timer: 0"; // 타이머 초기화
    }
}
// 시작할 때 초기값 넘기기
myGameArea.start();
