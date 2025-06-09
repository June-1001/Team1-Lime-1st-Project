var myGamePieces = [];
var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// 🎯 원을 생성하는 함수
function startGame() {
    myGameArea.start();
    myGamePieces = [];

    for (let i = 0; i < 6; i++) {
        let position = getRandomPosition();
        myGamePieces.push(new component(40, "#00eeaa", position.x, position.y));
    }

    drawGamePieces();
}

// 🎯 원을 제거하는 함수
function clearGame() {
    myGamePieces = [];
    myGameArea.clear();
}

// 🎨 원을 화면에 그리는 함수
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

// 🎯 원끼리 겹치지 않도록 랜덤 위치 생성
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
            return distance >= radius * 2;
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

myGameArea.start();