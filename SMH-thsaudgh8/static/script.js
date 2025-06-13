import { Component } from "./component.js";   // 원 컴포넌트 가져오기
import { myGameArea } from "./myGameArea.js";   // 게임 공간 가져오기
// import { gameTimer } from "./gameTimer.js";     // 게임 타이머 가져오기
// 게임 관련 변수
var myGamePieces = [];      //게임 피스 즉, 원들을 배열로 관리 할 수 있게끔 배열 선언 

// 게임 시작
function startGame() {      // 게임을 시작함
    myGamePieces = [];      // 게임 피스를 저장할 배열을 초기화함
    // 컴포넌트 속성을 지정해줌 반지름, 색상, x좌표, y좌표
    for (let i = 0; i < 6; i++) {
        let position = Component.getRandomPosition(myGameArea.canvas, 40, myGamePieces);
        myGamePieces.push(new Component(40, "#ff7777", position.x, position.y));    // 6개의 원을 생성해서 배열에 넣어줌 
    }

    drawGamePieces();       // drawGamePieces() 함수를 호출해서 캔버스에 그려줌
}

// 게임 초기화
function clearGame() {      // 원들을 저장한 배열, 게임 공간, 스코어, 게임 타이머 초기화
    myGamePieces = [];      // 타이머는 매개변수를 활용 , gameTimer함수 참조
    myGameArea.clear();
    document.getElementById("score").innerText = "Score: 0";
    gameTimer("off");
    return true;
}

// 클릭 처리
function handleClick(event) {
    const rect = myGameArea.canvas.getBoundingClientRect(); //getBoundingClientRect()를 활용해서 캔버스의 위치를 불러옴
    const mouseX = event.clientX - rect.left;   // 캔버스의 마우스 클릭 위치를 알려줌 
    const mouseY = event.clientY - rect.top;    // ex : mouseX = 500 (브라우저 기준 클릭 위치) - 100 (캔버스 시작 위치)= 400px (캔버스 내부에서의 클릭 위치)


    for (let i = 0; i < myGamePieces.length; i++) {
        const piece = myGamePieces[i];
        const dx = mouseX - piece.x;
        const dy = mouseY - piece.y;
        const distance = Math.sqrt(dx * dx + dy * dy);      // 마우스의 클릭 위치가 원의 중심에서 얼마나 떨어져있는지 구함

        if (distance < piece.radius) {
            const pos = Component.getRandomPosition(myGameArea.canvas, 40, myGamePieces);
            myGamePieces[i] = new Component(40, "#ff7777", pos.x, pos.y);
            drawGamePieces();
            addScore();     // 클릭 위치가 원의 거리 안쪽이면 해당되는 원의 위치를 다른곳에 그려주고 점수를 추가함
            break;      //break를 사용해서 한번만 처리함
        }
    }
}

// 점수 증가
function addScore() {
    const score = document.getElementById("score");     //score 요소를 참조
    const currentScore = parseInt(score.innerText.replace("Score: ", "")) || 0;     // 기존 점수를 currentScore 변수에 저장, 숫자가 없으면 0을 넣어줌
    score.innerText = "Score: " + (currentScore + 1);       // 점수를 1점 증가시켜서 표기
}

// 원 그리기
function drawGamePieces() {
    myGameArea.clear();     //게임 공간 초기화
    const ctx = myGameArea.context;     //게임 공간 안에있는 요소 참조(배열)

    myGamePieces.forEach(piece => piece.draw(ctx)); //게임 공간 안에있는 요소(배열)들을 그려줌
}
 let intervalId = "";    // interval을 사용하려면 전역 설정을 해줘야 가능, interval 전용 변수 생성

function gameTimer(switchState) {
    const timerEl = document.getElementById("timer");

    if (switchState == "on") {
        let timeLeft = 10;
        timerEl.innerText = "Timer: " + timeLeft;   // 스위치 상태가 on일때 시간제한을 10초로 설정하고 타이머에 추가

        intervalId = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerEl.innerText = "Timer: " + timeLeft;   // timeLeft 1감소 후, 가 0보다 클 경우 Timer에 출력
            } else {
                clearInterval(intervalId);
                timerEl.innerText = "Game Over";    // timeLeft가 0보다 작거나 같을 경우 , interval중지 , 게임 피스 초기화
                myGamePieces = [];
                myGameArea.clear();
            }
        }, 1000);   // interval을 1000ms(1초) 간격으로 실행
    } else {
        clearInterval(intervalId);
        timerEl.innerText = "Timer: 0";     // 스위치 상태가 on이 아닐경우 interval 중지, Timer: 0 출력
    }   // timer가 6,5,4 등 0이 아닐때 급하게 리셋버튼 눌렀을 시 실행되게끔 하는 로직
}

// 카운트다운 후 게임 시작
function startGameWithDelay() {
    const ctx = myGameArea.context; //게임 공간 안에있는 요소 참조
    let count = 3;  // 카운트 3초를 주고싶으니 3할당

    function updateCountdown() {
        myGameArea.clear();     // 게임 화면 초기화 

        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(count, myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);     // 함수가 표시될 폰트,위치,사이즈등을 정해줌

        if (count > 0) {
            count--;
            setTimeout(updateCountdown, 1000);
            document.getElementById("score").innerText = "Score: 0";
            document.getElementById("timer").innerText = "Timer: 0";    // 0보다 count가 크면 1씩 작아지면서 1초에 한번씩 실행됨 ,score와 timer를 0으로 설정
        } else {
            myGameArea.clear();
            startGame();
            gameTimer("on");        // 0보다 같거나 작은 경우 , 게임 공간 초기화 후 게임과 타이머 실행
        }
    }

    updateCountdown();      // 카운트다운 시작
}

// 시작
myGameArea.start(handleClick);
// 제일 아래쪽에 추가
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", startGameWithDelay);
    document.getElementById("resetBtn").addEventListener("click", clearGame);
}); // html이 다 로딩된 후 실행되게끔 하는 코드★