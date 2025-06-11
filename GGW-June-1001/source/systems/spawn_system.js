import { my_game_area, game_area_width, game_area_height } from "../core/game_core.js";
import {
  get_difficulty,
  increment_difficulty,
  get_score,
  game_running,
} from "../core/game_state.js";
import { Opponent } from "../entities/enemy.js";

export let obstacles = [];
export let floating_texts = [];
export let spawn_timers = [];
export let spawn_interval = 1000;
export let last_spawn_time = 0;

export function add_floating_text(x, y, text) {
  floating_texts.push({
    x,
    y,
    text,
    opacity: 1,
    life: 50,
  });
}

export function update_floating_texts() {
  const ctx = my_game_area.context;
  if (!ctx) return;

  for (let i = floating_texts.length - 1; i >= 0; i--) {
    const t = floating_texts[i];
    ctx.globalAlpha = t.opacity;
    ctx.font = "bold 20px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(t.text, t.x, t.y);
    ctx.globalAlpha = 1;
    ctx.shadowColor = "rgb(255, 255, 255)";
    ctx.shadowBlur = 25;
    t.y -= 0.5;

    t.opacity -= 1 / t.life;
    if (t.opacity <= 0) {
      floating_texts.splice(i, 1);
    }
  }
}

class SpawnTimer {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.progress = 0;
    this.speed = 0.02;
  }

  update() {
    const ctx = my_game_area.context;
    if (!ctx) return false;

    if (this.progress < 1.04) {
      this.progress += this.speed;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2 * this.progress);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 12;
      ctx.shadowColor = "rgb(255, 0, 0)";
      ctx.shadowBlur = 15;
      ctx.stroke();
    } else {
      this.spawn_opponent();
      return true;
    }
    return false;
  }

  spawn_opponent() {
    obstacles.push(
      new Opponent(this.size, this.size, this.x - this.size / 2, this.y - this.size / 2)
    );
    increment_difficulty();
  }
}

export function create_spawn_timer() {
  const size = 30 + Math.random() * 30;
  const x = size + Math.random() * (game_area_width - size * 2);
  const y = size + Math.random() * (game_area_height - size * 2);

  spawn_timers.push(new SpawnTimer(x, y, size));
}

export function update_spawn_timers() {
  const now = Date.now();
  if (now - last_spawn_time > spawn_interval && game_running) {
    create_spawn_timer();
    last_spawn_time = now;
    spawn_interval = Math.max(200, 1000 - get_score() / 50);
  }

  for (let i = spawn_timers.length - 1; i >= 0; i--) {
    if (spawn_timers[i].update()) {
      spawn_timers.splice(i, 1);
    }
  }
}

export function reset_spawn_system() {
  obstacles = [];
  spawn_timers = [];
  floating_texts = [];
  spawn_interval = 1000;
  last_spawn_time = 0;
}
