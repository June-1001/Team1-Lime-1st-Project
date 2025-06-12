export default class Swatter {    //파리채의 마우스 추적과 충돌판정을 책임지는 모듈 생성
  constructor(el, gameArea) {
    this.el = el;
    this.area = gameArea;
  }

  onClick(handler) {
    this.el.addEventListener('click', handler);
  }

  followCursor() {
  const HEAD_HEIGHT = 100;  
  this.area.addEventListener('mousemove', e => {
    const rect = this.area.getBoundingClientRect();
    const w = this.el.offsetWidth, h = this.el.offsetHeight;
    const x = e.clientX - rect.left - w/2;
    const y = e.clientY - rect.top  - (h - HEAD_HEIGHT); 
    const clampedX = Math.max(0, Math.min(x, rect.width - w));
    const clampedY = Math.max(0, Math.min(y, rect.height - h));
    Object.assign(this.el.style, { left: `${clampedX}px`, top: `${clampedY}px` });
  });
}


  getHeadRect() {
    const r = this.el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.left + r.width, bottom: r.top + 60 };
  }

  show() { this.el.style.display = 'block'; }
  hide() { this.el.style.display = 'none'; }
}
