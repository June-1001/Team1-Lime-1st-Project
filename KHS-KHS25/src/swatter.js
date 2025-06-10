export default class Swatter {
  constructor(el, gameArea) {
    this.el = el;
    this.area = gameArea;
  }

  onClick(handler) {
    this.el.addEventListener('click', handler);
  }

  followCursor() {
    this.area.addEventListener('mousemove', e => {
      const rect = this.area.getBoundingClientRect();
      const w = this.el.offsetWidth, h = this.el.offsetHeight;
      let x = e.clientX - rect.left - w/2;
      let y = e.clientY - rect.top  - (h - 20);
      x = Math.max(0, Math.min(x, rect.width  - w));
      y = Math.max(0, Math.min(y, rect.height - h));
      Object.assign(this.el.style, { left: `${x}px`, top: `${y}px` });
    });
  }

  getHeadRect() {
    const r = this.el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.left + r.width, bottom: r.top + 60 };
  }

  show() { this.el.style.display = 'block'; }
  hide() { this.el.style.display = 'none'; }
}
