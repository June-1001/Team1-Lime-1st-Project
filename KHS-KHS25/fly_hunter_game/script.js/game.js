import Fly from './fly.js';
import Swatter from './swatter.js';

// 메시지 상수 모음
const messages = {
  endGame:   '게임 끝! 최종 점수',
  playWait:  '... 플레이 대기중'
};

export default class Game { //게임 시작, 타이머, 득점, 랭킹 등의 전반적인 흐름과 상태관리를 담당하는 모듈
  constructor() {
    this._ended = false;    //게임 종료 여부 확인
    // DOM 참조
    this.menu          = document.getElementById('menu');
    this.container     = document.getElementById('game-container');
    this.infoContainer = document.getElementById('info-container');  // ← 추가
    this.flyEl         = document.getElementById('fly');
    this.swatterEl     = document.getElementById('swatter');
    this.backBtn       = document.getElementById('backBtn');
    this.finishBtn     = document.getElementById('finishBtn');
    this.scoreEl       = document.getElementById('score');
    this.timeEl        = document.getElementById('time');
    this.endBox        = document.getElementById('end');
    this.finalMsg      = document.getElementById('finalMsg');
    this.rankTitle     = document.getElementById('rankTitle');
    this.ranking       = document.getElementById('ranking');
    this.restart       = document.getElementById('restartBtn');
    this.gameArea      = document.getElementById('game');

    // 객체 인스턴스
    this.fly     = new Fly(this.flyEl, this.gameArea, this.backBtn);
    this.swatter = new Swatter(this.swatterEl, this.gameArea);

    // 이벤트
    this.swatter.onClick(() => this.hit());
    this.swatter.followCursor();
    this.restart.addEventListener('click', () => this.start());
    this.backBtn.addEventListener('click', () => this.backToMenu());
    this.finishBtn.addEventListener('click', () => this.end());

    // 초기 숨김
    this.finishBtn.classList.add('hidden');
  }

  // 난이도 설정
  setDifficulty = (level, speed) => {
    this.currentLevel = level;
    this.moveInterval = speed;
  }

  // 게임 시작
  start = () => {
    this._ended = false;    //매번 시작할때 종료되지 않은 상태로 리셋
    // 1) 정보 섹션 전부 숨기기
    this.infoContainer.classList.add('hidden');     // ← 추가

    // 2) 점수·시간 초기화
    this.score = 0;
    this.time  = 15;
    this.updateHUD();

    // 3) 메뉴 숨기고 게임 화면 보이기
    this.menu.classList.add('hidden');
    this.container.classList.remove('hidden');

    // 4) 끝내기 버튼 보이기
    this.finishBtn.classList.remove('hidden');
    this.endBox.style.display = 'none';

    // 5) 파리·채 보이기
    this.fly.show();
    this.swatter.show();

    // 6) 첫 이동 및 인터벌/타이머 시작
    this.fly.move(true);
    this.timerId = setInterval(() => this.tick(), 1000);
    this.moveId  = setInterval(() => this.fly.move(), this.moveInterval);
  }

  // 1초마다 호출
  tick = () => {
    this.time--;
    this.updateHUD();
    if (this.time <= 0) this.end();
  }

  // 파리채로 터치해 파리 죽이기
  hit = () => {
    const f = this.flyEl.getBoundingClientRect();
    const h = this.swatter.getHeadRect();
    if (
      !( h.right  < f.left  ||
         h.left   > f.right ||
         h.bottom < f.top   ||
         h.top    > f.bottom )
    ) {
      this.score++;
      this.updateHUD();
      this.fly.move();
    }
  }

  // 점수/시간 갱신
  updateHUD = () => {
    this.scoreEl.textContent = this.score;
    this.timeEl.textContent  = this.time;
  }

  // 게임 종료
  end = () => {
    if (this._ended) return;  // 이미 한 번 종료된 상태면 바로 리턴
    this._ended = true;       // 이제 종료 처리 시작
    
    clearInterval(this.timerId);
    clearInterval(this.moveId);

    this.fly.hide();
    this.swatter.hide();
    this.finishBtn.classList.add('hidden');

    // 랭킹 저장
    const key   = `flyHunterScores_${this.currentLevel}`;
    const arr   = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(this.score);
    arr.sort((a,b) => b - a);
    const top10 = arr.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(top10));

    // 랭킹 표시
    this.showRanking(top10);

    // 메시지 객체 활용
    this.finalMsg.innerText = `${messages.endGame}: ${this.score}`;
    this.endBox.style.display  = 'block';
    this.restart.style.display = 'inline-block';
  }

  // Top10 랭킹
  showRanking = (arr) => {
    this.rankTitle.textContent =
      `${this.currentLevel === 'beginner'? '초급'
      : this.currentLevel === 'intermediate'? '중급'
      : '고급'} 랭킹 (Top 10)`;

    this.ranking.innerHTML = '';
    arr.forEach(value => {
      const li = document.createElement('li');
      li.textContent = `${value} 점`;
      this.ranking.appendChild(li);
    });

    for (let i = arr.length; i < 10; i++) {
      const li = document.createElement('li');
      li.innerText = messages.playWait;
      this.ranking.appendChild(li);
    }
  }

  // 메뉴로 돌아가기
  backToMenu = () => {
    clearInterval(this.timerId);
    clearInterval(this.moveId);

    this.container.classList.add('hidden');
    this.menu.classList.remove('hidden');

    // 정보 영역 다시 보이기
    this.infoContainer.classList.remove('hidden'); // ← 추가
  }
}