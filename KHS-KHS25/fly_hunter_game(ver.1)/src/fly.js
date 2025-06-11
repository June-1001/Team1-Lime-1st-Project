export default class Fly {    //파리 위치 재계산과 이동을 책임지는 모듈 생성
  constructor(flyEl, gameArea, backBtn) {
    this.el = flyEl;
    this.area = gameArea;
    this.backBtn = backBtn;
  }

  randomPos() {
    const rect = this.area.getBoundingClientRect();
    const fw = this.el.offsetWidth, fh = this.el.offsetHeight;
    const b = this.backBtn.getBoundingClientRect();
    const forbid = {
      left: b.left - rect.left,
      top:  b.top  - rect.top,
      right: b.right - rect.left,
      bottom: b.bottom - rect.top
    };

    let x, y, tries = 0;
    do {
      x = Math.random() * (rect.width  - fw);
      y = Math.random() * (rect.height - fh);
      tries++;
    } while (
      x + fw  > forbid.left &&
      x        < forbid.right &&
      y + fh  > forbid.top &&
      y        < forbid.bottom &&
      tries < 100
    );

    return { x, y };
  }

  move(init = false) {
    const { x, y } = this.randomPos();
    const angle = Math.random() * 360;
    Object.assign(this.el.style, {
      left: `${x}px`,
      top:  `${y}px`,
      transform: `rotate(${angle}deg)`
    });
    if (init) {
      this.el.style.transition = 'none';
      requestAnimationFrame(() => {
        this.el.style.transition = 'left 0.6s linear, top 0.6s linear, transform 0.6s linear';
      });
    }
  }

  show() { this.el.style.display = 'block'; }
  hide() { this.el.style.display = 'none'; }
}