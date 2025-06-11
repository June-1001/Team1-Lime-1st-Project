import { keys } from "../core/input.js";
import { game_area_width, game_area_height, my_game_area } from "../core/game_core.js";
import { game_running } from "../core/game_state.js";

export const player = {
  x: game_area_width / 2,
  y: game_area_height / 2,
  radius: 15,
  color: "rgba(255,255,255,0.6)",
  speed: 9,
  trail: [],
  max_trail_length: 15,
  prev_x: game_area_width / 2,
  prev_y: game_area_height / 2,

  move: function () {
    this.prev_x = this.x;
    this.prev_y = this.y;

    if ((keys.arrow_up || keys.w) && this.y - this.radius > 0) {
      this.y -= this.speed;
    }
    if ((keys.arrow_down || keys.s) && this.y + this.radius < game_area_height) {
      this.y += this.speed;
    }
    if ((keys.arrow_left || keys.a) && this.x - this.radius > 0) {
      this.x -= this.speed;
    }
    if ((keys.arrow_right || keys.d) && this.x + this.radius < game_area_width) {
      this.x += this.speed;
    }
  },

  update: function () {
    const ctx = my_game_area.context;
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    if (game_running) {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });

      if (this.trail.length > this.max_trail_length) {
        this.trail.shift();
      }
    }

    this.trail.forEach((t, i) => {
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();

      t.alpha = (i / this.max_trail_length) ** 3;
    });
  },

  reset_trail: function () {
    this.trail = [];
  },
};
