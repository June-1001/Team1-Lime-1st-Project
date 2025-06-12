import Fly from './fly.js';
import Swatter from './swatter.js';

// 메시지 상수 모음
const messages = {
  endGame:   '게임 끝! 최종 점수',
  playWait:  '... 플레이 대기중'
};

export default class Game {
  constructor() {
    // DOM 참조
    this.menu      = document.getElementById('menu');
    this.container = document.getElementById('game-container');
    this.flyEl     = document.getElementById('fly');
    this.swatterEl = document.getElementById('swatter');
    this.backBtn   = document.getElementById('backBtn');
    this.finishBtn = document.getElementById('finishBtn');
    this.scoreEl   = document.getElementById('score');
    this.timeEl    = document.getElementById('time');
    this.endBox    = document.getElementById('end');
    this.finalMsg  = document.getElementById('finalMsg');
    this.rankTitle = document.getElementById('rankTitle');
    this.ranking   = document.getElementById('ranking');
    this.restart   = document.getElementById('restartBtn');
    this.gameArea  = document.getElementById('game');

    // 객체 인스턴스
    this.fly      = new Fly(this.flyEl, this.gameArea, this.backBtn);
    this.swatter  = new Swatter(this.swatterEl, this.gameArea);

    // 이벤트 바인딩
    this.swatter.onClick(() => this.hit());
    this.swatter.followCursor();
    this.restart.addEventListener('click', () => this.start());
    this.backBtn .addEventListener('click', () => this.backToMenu());
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
    this.score = 0;
    this.time  = 30;
    this.updateHUD();

    this.menu.classList.add('hidden');
    this.container.classList.remove('hidden');
    this.finishBtn.classList.remove('hidden');
    this.endBox.style.display = 'none';

    this.fly.show();
    this.swatter.show();

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

    // 빈 순위는 playWait(...플레이 대기중) 메시지로 채웠음(나중에 더 좋은 문구 생각나면 변경)
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
  }
}