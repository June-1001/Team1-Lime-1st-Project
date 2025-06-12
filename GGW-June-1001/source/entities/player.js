import { keys } from "../core/input.js";
import { game_area_width, game_area_height, my_game_area } from "../core/game_core.js";
import { game_running } from "../core/game_state.js";
import { player_costumes } from "./player_costumes.js";

//--------------//
// 플레이어 설정 //
//--------------//

export const player = {
  x: game_area_width / 2,
  y: game_area_height / 2,
  speed: 9,
  trail: [],
  max_trail_length: 15,
  prev_x: game_area_width / 2,
  prev_y: game_area_height / 2,
  current_costume: 0,
  costumes: player_costumes,

  move: function () {
    const costume = this.costumes[this.current_costume];
    const radius = costume.radius;

    this.prev_x = this.x;
    this.prev_y = this.y;

    if ((keys.arrow_up || keys.w) && this.y - radius > 0) {
      this.y -= this.speed;
    }
    if ((keys.arrow_down || keys.s) && this.y + radius < game_area_height) {
      this.y += this.speed;
    }
    if ((keys.arrow_left || keys.a) && this.x - radius > 0) {
      this.x -= this.speed;
    }
    if ((keys.arrow_right || keys.d) && this.x + radius < game_area_width) {
      this.x += this.speed;
    }
  },

  update: function () {
    const ctx = my_game_area.context;
    if (!ctx) {
      return;
    }

    const costume = this.costumes[this.current_costume];
    if (!costume || typeof costume.draw !== "function") {
      return;
    }

    const radius = costume.radius;

    costume.draw(ctx, this.x, this.y, radius);

    if (game_running) {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });

      if (this.trail.length > this.max_trail_length) {
        this.trail.shift();
      }
    }

    if (typeof costume.trail_draw === "function") {
      this.trail.forEach(function (t, i) {
        t.alpha = (i / this.max_trail_length) ** 2;
        costume.trail_draw(ctx, t.x, t.y, radius, t.alpha);
      }, this);
    }
  },

  reset_trail: function () {
    this.trail = [];
  },

  set_costumes: function (costumes) {
    this.costumes = costumes;
  },

  set_costume: function (costume_number) {
    if (this.costumes[costume_number] && this.costumes[costume_number].unlocked) {
      this.current_costume = costume_number;
    }
  },
};
