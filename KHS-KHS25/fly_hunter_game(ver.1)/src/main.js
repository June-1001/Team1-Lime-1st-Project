import Game from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  // 난이도 버튼
  document.querySelectorAll('#menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      game.setDifficulty(btn.dataset.level, parseInt(btn.dataset.speed, 10));
      game.start();
    });
  });
});