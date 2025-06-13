export let intervalId = "";    // interval을 사용하려면 전역 설정을 해줘야 가능, interval 전용 변수 생성

export function gameTimer(switchState) {
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
                myGamePieces = [];
                timerEl.innerText = "Game Over";    // timeLeft가 0보다 작거나 같을 경우 , interval중지 , 게임 피스 초기화
                myGameArea.clear();     // 타이머 부분에 Game Over 출력 후 게임 공간 초기화
            }
        }, 1000);   // interval을 1000ms(1초) 간격으로 실행
    } else {
        clearInterval(intervalId);
        timerEl.innerText = "Timer: 0";     // 스위치 상태가 on이 아닐경우 interval 중지, Timer: 0 출력
    }   // timer가 6,5,4 등 0이 아닐때 급하게 리셋버튼 눌렀을 시 실행되게끔 하는 로직
}