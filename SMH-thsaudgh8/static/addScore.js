// 점수 증가
export function addScore() {
    const score = document.getElementById("score");     //score 요소를 참조
    const currentScore = parseInt(score.innerText.replace("Score: ", "")) || 0;     // 기존 점수를 currentScore 변수에 저장, 숫자가 없으면 0을 넣어줌
    score.innerText = "Score: " + (currentScore + 1);       // 점수를 1점 증가시켜서 표기
}