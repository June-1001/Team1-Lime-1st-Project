class Component {
    constructor(radius, color, x, y) { //원의 속성 선언 : 반지름, 색, x좌표, y좌표  
        this.radius = radius;   //여기서 this는 새로 생성되는 객체를 가리킴
        this.color = color;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;  //ctx 색 결정하는 부분
        ctx.beginPath();    //독립된 개체로 그려지게끔 만드는 코드
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // 독립된 개체에 들어갈 속성 , x좌표, y좌표, 반지름, 원을 그리는 시작 각도, 끝 각도
        ctx.fill();         // 채우기 
    }

    static getRandomPosition(canvas, radius, gamePieces) { //랜덤한 위치에 원을 생성하기위한 함수 , static 사용 = 인스턴스 없이 사용할 수 있어서 
        let x, y, valid;                                   //Component.getRandomPosition(. . .) 식으로 사용 가능  Component.getRandomPosition(myGameArea.canvas, 40, myGamePieces);

        do {
            x = Math.random() * (canvas.width - 2 * radius) + radius;   //원이 캔버스 안에 있게끔 만들어주는 코드
            y = Math.random() * (canvas.height - 2 * radius) + radius;

            valid = gamePieces.every(piece => { //every는 배열의 모든 요소가 조건을 충족해야 true가 된다 myGamePieces를 받고 있으므로 배열임
                const dx = x - piece.x;     //새로 생길 원의 x좌표와 y좌표 비교한것
                const dy = y - piece.y;
                const distance = Math.sqrt(dx * dx + dy * dy);  // 피타고라스 정리를 활용한 두 점 사이의 거리 구하기 
                return distance >= radius * 2.5;        // 거리가 반지름의 2.5배 이상 떨어져야 함
            });
        } while (!valid);

        return { x, y };        // 모든 배열 요소의 x좌표와 y좌표를 비교하고 만약 거리가 2.5r 이상 안떨어져 있으면 다시구하는 함수
    }
}

// 게임 관련 변수
var myGamePieces = [];      //게임 피스 즉, 원들을 배열로 관리 할 수 있게끔 배열 선언 

var myGameArea = {          //게임 공간을 할당함 , canvas 요소를 가져오며 캔버스의 가로 세로 크기를 정함
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("click", handleClick);     // 캔버스에 들어갈 효과를 넣어줌 (캔버스 클릭시 발생하는 이벤트를 입력)
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    // 캔버스를 초기화 해주는 함수
    }
};

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

// 타이머
let intervalId = "";    // interval을 사용하려면 전역 설정을 해줘야 가능, interval 전용 변수 생성

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
                myGameArea.clear();
            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        timerEl.innerText = "Timer: 0";
    }
}

// 시작
myGameArea.start();
