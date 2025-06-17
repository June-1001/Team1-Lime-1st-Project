export const myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function (handleClick) {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("click", handleClick);

        this.drawGrid(); // 시작할 때 바둑판 배경을 그림
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(); // 화면을 초기화한 후 다시 배경을 그림
    },
    drawGrid: function () {
        const gridSize = 40;
        this.context.fillStyle = "#0b2f64"; 
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.strokeStyle = "#eeeeee"; 
        this.context.lineWidth = 1;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {    //X축 간격 정해주기
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
            this.context.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {   //Y축 간격 정해주기
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
            this.context.stroke();
        }
    }
};
