export const myGameArea = {          //게임 공간을 할당함 , canvas 요소를 가져오며 캔버스의 가로 세로 크기를 정함
    canvas: document.getElementById("gameCanvas"),
    start: function (handleClick) {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");

        this.canvas.addEventListener("click", handleClick);     // 캔버스에 들어갈 효과를 넣어줌 (캔버스 클릭시 발생하는 이벤트를 입력)
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    // 캔버스를 초기화 해주는 함수
    }
};
