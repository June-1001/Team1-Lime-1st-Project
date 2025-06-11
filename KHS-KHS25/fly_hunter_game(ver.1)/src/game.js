import Fly from './fly.js';
import Swatter from './swatter.js';

export default class Game {   //게임의 전체적인 흐름을 책임지는 모듈 생성
  constructor() {
    // DOM
    this.menu     = document.getElementById('menu');
    this.container= document.getElementById('game-container');
    this.flyEl    = document.getElementById('fly');
    this.swatterEl= document.getElementById('swatter');
    this.backBtn  = document.getElementById('backBtn');
    this.finishBtn= document.getElementById('finishBtn');
    this.scoreEl  = document.getElementById('score');
    this.timeEl   = document.getElementById('time');
    this.endBox   = document.getElementById('end');
    this.finalMsg = document.getElementById('finalMsg');
    this.rankTitle= document.getElementById('rankTitle');
    this.ranking  = document.getElementById('ranking');
    this.restart  = document.getElementById('restartBtn');
    this.gameArea = document.getElementById('game');

    // 객체 인스턴스
    this.fly     = new Fly(this.flyEl, this.gameArea, this.backBtn);
    this.swatter = new Swatter(this.swatterEl, this.gameArea);

    // 이벤트
    this.swatter.onClick(() => this.hit());
    this.swatter.followCursor();
    this.restart.addEventListener('click', ()=> this.start());
    this.backBtn.addEventListener('click', ()=> this.backToMenu());
    this.finishBtn.addEventListener('click', ()=> this.end());

    // 초기 숨김
    this.finishBtn.classList.add('hidden');
  }

  setDifficulty(level, speed) {
    this.currentLevel = level;
    this.moveInterval = speed;
  }

  start() {
    // 상태 초기화
    this.score = 0;
    this.time  = 30;
    this.updateHUD();

    // UI 전환
    this.menu.classList.add('hidden');
    this.container.classList.remove('hidden');
    this.finishBtn.classList.remove('hidden');
    this.endBox.style.display = 'none';

    // 객체 표시
    this.fly.show();
    this.swatter.show();

    // 첫 이동 + 타이머
    this.fly.move(true);
    this.timerId = setInterval(()=> this.tick(), 1000);
    this.moveId  = setInterval(()=> this.fly.move(), this.moveInterval);
  }

  tick() {
    this.time--;
    this.updateHUD();
    if (this.time <= 0) this.end();
  }

  hit() {
    const flyRect = this.flyEl.getBoundingClientRect();
    const head    = this.swatter.getHeadRect();
    if (
      !( head.right < flyRect.left ||
         head.left  > flyRect.right ||
         head.bottom< flyRect.top ||
         head.top   > flyRect.bottom )
    ) {
      this.score++;
      this.updateHUD();
      this.fly.move();
    }
  }

  updateHUD() {
    this.scoreEl.textContent = this.score;
    this.timeEl.textContent  = this.time;
  }

  end() {
    clearInterval(this.timerId);
    clearInterval(this.moveId);
    this.fly.hide();
    this.swatter.hide();
    this.finishBtn.classList.add('hidden');

    // 랭킹 저장 및 표시
    const key   = `flyHunterScores_${this.currentLevel}`;
    const arr   = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(this.score);
    arr.sort((a,b)=>b-a);
    const top10 = arr.slice(0,10);
    localStorage.setItem(key, JSON.stringify(top10));

    // 게임 완료 후 표시
    this.showRanking(top10);
    this.finalMsg.textContent = `게임 끝! 최종 점수: ${this.score}`;
    this.endBox.style.display = 'block';
    this.restart.style.display = 'inline-block';
  }

  showRanking(arr) {
    this.rankTitle.textContent = `${this.currentLevel === 'beginner'? '초급' : this.currentLevel==='intermediate'? '중급':'고급'} 랭킹 (Top 10)`;
    this.ranking.innerHTML = '';
    arr.forEach(value => {
      const li = document.createElement('li');
      li.textContent = `${value} 점`;
      this.ranking.appendChild(li);
    });
    for (let i = arr.length; i < 10; i++) {
      const li = document.createElement('li');
      li.textContent = '...플레이 대기 중';
      this.ranking.appendChild(li);
    }
  }

  backToMenu() {
    clearInterval(this.timerId);
    clearInterval(this.moveId);
    this.container.classList.add('hidden');
    this.menu.classList.remove('hidden');
  }
}