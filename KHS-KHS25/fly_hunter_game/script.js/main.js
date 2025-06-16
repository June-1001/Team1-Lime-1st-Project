import Game from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  // 정보 버튼
  const menu          = document.getElementById('menu');
  const infoContainer = document.getElementById('info-container');
  const btnGameInfo   = document.getElementById('btnGameInfo');
  const btnCodeInfo   = document.getElementById('btnCodeInfo');
  const btnFlowchart  = document.getElementById('btnFlowchart');
  const gameInfo      = document.getElementById('game-info');
  const codeInfo      = document.getElementById('code-info');
  const flowchartInfo = document.getElementById('flowchart-info');

  // 섹션 토글 헬퍼
  const showSection = sectionEl => {
    [gameInfo, codeInfo, flowchartInfo].forEach(x => x.classList.add('hidden'));
    if (sectionEl) {
      menu.classList.add('hidden');
      infoContainer.classList.remove('hidden');
      sectionEl.classList.remove('hidden');
    } else {
      infoContainer.classList.add('hidden');
      menu.classList.remove('hidden');
    }
  };

  btnGameInfo.addEventListener('click',  () => showSection(gameInfo));
  btnCodeInfo.addEventListener('click',  () => showSection(codeInfo));
  btnFlowchart.addEventListener('click', () => showSection(flowchartInfo));

  const infoBackBtn = document.getElementById('infoBackBtn');
  infoBackBtn.addEventListener('click', () => showSection(null));

  const game = new Game();
  const finishBtn = document.getElementById('finishBtn');
  finishBtn.addEventListener('click', () => game.end());
  
   // 난이도 버튼
  document.querySelectorAll('#menu button[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      game.setDifficulty(btn.dataset.level, +btn.dataset.speed);
      showSection(null); 
      game.start();
    });
  });
});