export class Component {
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
