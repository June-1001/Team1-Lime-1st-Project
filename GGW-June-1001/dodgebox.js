//////////////////////
// 화면 및 조작 세팅 //
//////////////////////

const game_container = document.getElementById("game_container");

// 게임 화면 크기
const game_area_width = 900;
const game_area_height = 750;

// 키보드 세팅
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

function handle_key_down(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
}

function handle_key_up(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
}

document.addEventListener("keydown", handle_key_down);
document.addEventListener("keyup", handle_key_up);

document.addEventListener("keydown", function (e) {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", function (e) {
  keys[e.key.toLowerCase()] = false;
});

// 게임 캔버스 세팅
const my_game_area = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = game_area_width;
    this.canvas.height = game_area_height;
    this.context = this.canvas.getContext("2d");
    if (!this.canvas.parentElement) {
      game_container.appendChild(this.canvas);
    }
    clearInterval(game_update_interval);
    game_update_interval = setInterval(update_game_area, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

//////////////////
// 플레이어 세팅 //
//////////////////

let player = {
  x: game_area_width / 2,
  y: game_area_height / 2,
  radius: 20,
  color: "rgba(255,255,255,0.6)",
  speed: 6,

  trail: [],
  max_trail_length: 15,

  move: function () {
    if ((keys.ArrowUp || keys.w) && this.y - this.radius > 0) {
      this.y -= this.speed;
    }
    if ((keys.ArrowDown || keys.s) && this.y + this.radius < game_area_height) {
      this.y += this.speed;
    }
    if ((keys.ArrowLeft || keys.a) && this.x - this.radius > 0) {
      this.x -= this.speed;
    }
    if ((keys.ArrowRight || keys.d) && this.x + this.radius < game_area_width) {
      this.x += this.speed;
    }
  },

  update: function () {
    const ctx = my_game_area.context;

    if (this.x !== this.prev_x || this.y !== this.prev_y) {
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

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  },
};

/////////////
// 적 세팅 //
/////////////

let obstacles = [];
let difficulty = 0;

const rainbow_colors = [
  "rgba(231, 52, 52, 0.9)",
  "rgba(230, 130, 34, 0.9)",
  "rgba(241, 196, 15, 0.9)",
  "rgba(39, 174, 96, 0.9)",
  "rgba(0, 180, 170, 0.9)",
  "rgba(80, 130, 255, 0.9)",
  "rgba(155, 89, 182, 0.9)",
];

class Opponent {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.dx = Math.sign(Math.random() - 0.5) * (Math.random() * 3.5 + score / 10000);
    this.dy = Math.sign(Math.random() - 0.5) * (Math.random() * 3.5 + score / 10000);
    this.color_index = Math.floor(Math.random() * rainbow_colors.length);

    this.hp = Math.floor(1 + difficulty);
    this.max_hp = this.hp;
  }

  move() {
    const next_x = this.x + this.dx;
    const next_y = this.y + this.dy;
    if (next_x > game_area_width - this.width || next_x < 0) {
      this.dx = -Math.sign(this.dx) * (Math.random() * 3.5 + score / 10000);
      this.color_index = (this.color_index + 1) % rainbow_colors.length;
    }
    if (next_y > game_area_height - this.height || next_y < 0) {
      this.dy = -Math.sign(this.dy) * (Math.random() * 3.5 + score / 10000);
      this.color_index = (this.color_index + 1) % rainbow_colors.length;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  update() {
    const ctx = my_game_area.context;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.shadowColor = rainbow_colors[this.color_index];
    ctx.shadowBlur = 15;
    ctx.fillStyle = rainbow_colors[this.color_index];
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.hp < this.max_hp) {
      const health_percent = this.hp / this.max_hp;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(this.x, this.y - 10, this.width, 5);
      ctx.fillStyle = health_percent > 0.6 ? "lime" : health_percent > 0.3 ? "yellow" : "red";
      ctx.fillRect(this.x, this.y - 10, this.width * health_percent, 5);
    }

    ctx.restore();
  }
}

///////////////////
// 적 스폰 시스템 //
///////////////////

// 적 생성 시 점수 +10 텍스트 표시
let floating_texts = [];

function add_floating_text(x, y, text = "+10") {
  floating_texts.push({
    x,
    y,
    text,
    opacity: 1,
    life: 50,
  });
}

function update_floating_texts(ctx) {
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
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    t.y -= 0.5;
    t.opacity -= 1 / t.life;
    if (t.opacity <= 0) {
      floating_texts.splice(i, 1);
    }
  }
}

// 스폰 타이머, 다 그려지면 삭제하고 그 위치에 적을 생성
let spawn_timers = [];
const score_display = document.getElementById("score_display");

class SpawnTimer {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.progress = 0;
  }

  update() {
    const ctx = my_game_area.context;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2 * this.progress);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 12;
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.stroke();
  }

  spawn() {
    if (this.progress < 1.04) {
      this.progress += 0.02;
      return false;
    } else {
      obstacles.push(
        new Opponent(this.size, this.size, this.x - this.size / 2, this.y - this.size / 2)
      );
      difficulty += 1;
      score_display.textContent = `점수: ${score}`;
      return true;
    }
  }
}

function create_spawn_timer() {
  if (!game_running) {
    return;
  }

  const size = 30 + Math.random() * 30;
  const x = size + Math.random() * (game_area_width - size * 2);
  const y = size + Math.random() * (game_area_height - size * 2);

  const timer = new SpawnTimer(x, y, size);
  spawn_timers.push(timer);
}

function start_spawning() {
  create_spawn_timer();
  let interval = Math.max(200, 1000 - score / 100);
  spawn_timer_interval = setInterval(create_spawn_timer, interval);
}

///////////////
// 게임 시작 //
///////////////

let game_running = false;
let score = 0;
let score_counter = 0;
let spawn_timer_interval;
let game_update_interval;
const center_overlay = document.getElementById("center_overlay");
const video = document.getElementById("background_video");

function start_game() {
  clearInterval(spawn_timer_interval);
  clearInterval(game_update_interval);
  start_btn.style.display = "none";
  center_overlay.style.display = "none";
  show_div(comment_start, start_btn);
  show_div(comment_restart, center_overlay);
  obstacles = [];
  spawn_timers = [];
  floating_texts = [];
  player.trail = [];
  score = 0;
  score_counter = 0;
  game_running = true;
  score_display.textContent = `점수: ${score}`;
  start_spawning();
  my_game_area.start();
  video.style.display = "block";
  video.play();
  difficulty = 0;
  update_shop_visibility();
}

function update_game_area() {
  my_game_area.clear();
  if (!game_running) return;

  score_counter++;
  if (score_counter >= 5) {
    score++;
    score_counter = 0;
    score_display.textContent = `점수: ${score}`;
    update_coins();
  }

  player.move();
  player.update();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].move();
    obstacles[i].update();
  }

  for (let i = spawn_timers.length - 1; i >= 0; i--) {
    spawn_timers[i].update();
    if (spawn_timers[i].spawn()) {
      spawn_timers.splice(i, 1);
    }
  }

  fire_bullet();
  update_bullets();
  update_floating_texts(my_game_area.context);
  check_collisions();
  check_bullet_collision();
}

////////////////////////
// 게임 오버 및 초기화 //
////////////////////////

function check_collisions() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    const closest_x = Math.max(obs.x, Math.min(player.x, obs.x + obs.width));
    const closest_y = Math.max(obs.y, Math.min(player.y, obs.y + obs.height));
    const distance_x = player.x - closest_x;
    const distance_y = player.y - closest_y;
    if (Math.sqrt(distance_x ** 2 + distance_y ** 2) < player.radius) {
      game_over();
      return;
    }
  }
}

function is_block(element) {
  return getComputedStyle(element).display === "block";
}

function show_div(div, menu) {
  if (is_block(menu)) {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}

const final_score_display = document.getElementById("final_score");

function game_over() {
  game_running = false;
  center_overlay.style.display = "block";
  score_display.textContent = "";
  final_score_display.textContent = `점수: ${score}`;
  show_div(comment_start, start_btn);
  show_div(comment_restart, center_overlay);
  difficulty = 0;
  coins += coins_from_score;
  coins_from_score = 0;
  save_game_data();
}

function restart_game() {
  center_overlay.style.display = "none";
  start_btn.style.display = "block";
  score_display.textContent = "";
  game_running = false;
  clearInterval(spawn_timer_interval);
  clearInterval(game_update_interval);
  obstacles = [];
  spawn_timers = [];
  floating_texts = [];
  bullets = [];
  my_game_area.clear();
  video.pause();
  video.style.display = "none";
  show_div(comment_start, start_btn);
  show_div(comment_restart, center_overlay);

  update_shop_visibility();
}

// Initialize shop visibility when page loads
window.addEventListener("load", () => {
  load_game_data();
  update_shop_visibility();
});

const start_btn = document.getElementById("start_button");
const restart_btn = document.getElementById("restart_button");

const comment_start = document.getElementById("comment_start");
const comment_restart = document.getElementById("comment_restart");

show_div(comment_start, start_btn);
show_div(comment_restart, center_overlay);

start_btn.addEventListener("click", start_game);
restart_btn.addEventListener("click", restart_game);

document.addEventListener("keydown", function (event) {
  if (event.code !== "Space") {
    return;
  }
  if (is_block(start_btn)) {
    event.preventDefault();
    start_game();
    return;
  }
  if (is_block(center_overlay)) {
    event.preventDefault();
    restart_game();
    return;
  }
});

////////////////////////////////
// 보고있지 않을 때 게임 멈추기 //
////////////////////////////////

let is_game_active = true;

function pause_game() {
  clearInterval(game_update_interval);
  clearInterval(spawn_timer_interval);
  video.pause();
  is_game_active = false;
}

function resume_game() {
  if (!is_game_active && game_running) {
    game_update_interval = setInterval(update_game_area, 20);
    spawn_timer_interval = setInterval(create_spawn_timer, 2000);
    video.play();
    is_game_active = true;
  }
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    pause_game();
  } else {
    resume_game();
  }
});

window.addEventListener("blur", function () {
  pause_game();
});

window.addEventListener("focus", function () {
  resume_game();
});

////////////////
// 총알 시스템 //
////////////////

let bullets = [];
let bullet_power = 1;
let bullet_speed = 10;
let bullet_size = 10;
let bullet_interval = 1000;
let last_bullet_time = 0;
let can_ricochet = false;
let ricochet_count = 0;
let max_ricochet = 0;
let max_pierce = 0;
let current_pierce = 0;
let bullet_cooldown = 0;

class Bullet {
  constructor(x, y, target_x, target_y) {
    this.x = x;
    this.y = y;
    this.target_x = target_x;
    this.target_y = target_y;
    this.speed = bullet_speed;
    this.size = bullet_size;
    this.damage = bullet_power;
    this.ricochet_count = max_ricochet;
    this.pierce_count = max_pierce;

    const dx = target_x - x;
    const dy = target_y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.dx = dx / distance;
    this.dy = dy / distance;
    this.angle = Math.atan2(dy, dx);
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    const ctx = my_game_area.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.shadowColor = "rgba(0, 200, 255, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillRect(0, -this.size / 2, this.size * 2, this.size);
    ctx.restore();
  }

  wall_collision() {
    return this.x < 0 || this.x > game_area_width || this.y < 0 || this.y > game_area_height;
  }
}

function update_bullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.update();
    bullet_cooldown += 20;

    let hit = false;

    for (let j = obstacles.length - 1; j >= 0; j--) {
      let obs = obstacles[j];

      if (check_bullet_collision(bullet, obs)) {
        obs.hp -= bullet.damage;
        hit = true;

        if (obs.hp <= 0) {
          score += kill_reward;
          add_floating_text(obs.x + obs.width / 2, obs.y + obs.height / 2, `+${kill_reward}`);
          obstacles.splice(j, 1);
        }

        if (bullet.pierce_count > 0) {
          bullet.pierce_count--;
        } else {
          bullets.splice(i, 1);
          break;
        }
      }
    }

    // Only allow ricochet IF it didn't hit an enemy
    if (!hit && can_ricochet && bullet.ricochet_count > 0) {
      let bounced = false;
      if (bullet.x < 0 || bullet.x > game_area_width) {
        bullet.dx *= -1;
        bounced = true;
      }
      if (bullet.y < 0 || bullet.y > game_area_height) {
        bullet.dy *= -1;
        bounced = true;
      }
      if (bounced) {
        bullet.ricochet_count--;
        bullet.angle = Math.atan2(bullet.dy, bullet.dx);
      }
    } else if (!hit && bullet.wall_collision()) {
      bullets.splice(i, 1);
    }
  }
}

function fire_bullet() {
  if (!game_running) {
    return;
  }

  if (Date.now() - last_bullet_time < bullet_interval) {
    return;
  }

  if (typeof cursor_x !== "number" || typeof cursor_y !== "number") {
    return;
  }

  bullets.push(new Bullet(player.x, player.y, cursor_x, cursor_y));
  last_bullet_time = Date.now();
}

function check_bullet_collision(bullet, obstacle) {
  return (
    bullet.x + bullet.size > obstacle.x &&
    bullet.x - bullet.size < obstacle.x + obstacle.width &&
    bullet.y + bullet.size > obstacle.y &&
    bullet.y - bullet.size < obstacle.y + obstacle.height
  );
}

let cursor_x, cursor_y;

game_container.addEventListener("mousemove", (e) => {
  const rect = game_container.getBoundingClientRect();
  cursor_x = e.clientX - rect.left;
  cursor_y = e.clientY - rect.top;
});

function update_bullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.update();
    bullet_cooldown += 20;

    let hit = false;

    for (let j = obstacles.length - 1; j >= 0; j--) {
      let obs = obstacles[j];

      if (check_bullet_collision(bullet, obs)) {
        obs.hp -= bullet.damage;
        hit = true;

        if (obs.hp <= 0) {
          score += kill_reward;
          add_floating_text(obs.x + obs.width / 2, obs.y + obs.height / 2, `+${kill_reward}`);
          obstacles.splice(j, 1);
        }

        if (bullet.pierce_count > 0) {
          bullet.pierce_count--;
        } else {
          bullets.splice(i, 1);
          break;
        }
      }
    }

    if (!hit && bullet.wall_collision()) {
      if (bullet.ricochet_count > 0) {
        if (bullet.x < 0 || bullet.x > game_area_width) {
          bullet.dx *= -1;
        }
        if (bullet.y < 0 || bullet.y > game_area_height) {
          bullet.dy *= -1;
        }
        bullet.ricochet_count--;
        bullet.angle = Math.atan2(bullet.dy, bullet.dx);
      } else {
        bullets.splice(i, 1);
      }
    }
  }
}

function check_bullet_collision(bullet, obstacle) {
  return (
    bullet.x > obstacle.x &&
    bullet.x < obstacle.x + obstacle.width &&
    bullet.y > obstacle.y &&
    bullet.y < obstacle.y + obstacle.height
  );
}

////////////////////
// 상점 업그레이드 //
////////////////////

let coins = 0;
let kill_reward = 10;
const shop_items = {
  bullet_power: {
    name: "Bullet Power",
    max_level: 10,
    current_level: 0,
    get_cost: () => bullet_power_costs[shop_items.bullet_power.current_level],
    effect: () => {
      bullet_power = bullet_power_values[shop_items.bullet_power.current_level];
    },
  },
  bullet_speed: {
    name: "Bullet Speed",
    max_level: 5,
    current_level: 0,
    get_cost: () => bullet_speed_costs[shop_items.bullet_speed.current_level],
    effect: () => {
      bullet_speed = bullet_speed_values[shop_items.bullet_speed.current_level];
    },
  },
  fire_rate: {
    name: "Fire Rate",
    max_level: 10,
    current_level: 0,
    get_cost: () => fire_rate_costs[shop_items.fire_rate.current_level],
    effect: () => {
      bullet_interval = fire_rate_values[shop_items.fire_rate.current_level];
    },
  },
  ricochet: {
    name: "Ricochet",
    max_level: 5,
    current_level: 0,
    get_cost: () => ricochet_costs[shop_items.ricochet.current_level],
    effect: () => {
      max_ricochet = ricochet_values[shop_items.ricochet.current_level];
      can_ricochet = max_ricochet > 0;
    },
  },
  pierce: {
    name: "Pierce",
    max_level: 5,
    current_level: 0,
    get_cost: () => pierce_costs[shop_items.pierce.current_level],
    effect: () => {
      max_pierce = pierce_values[shop_items.pierce.current_level];
    },
  },
  kill_reward: {
    name: "Kill Reward",
    max_level: 10,
    current_level: 0,
    get_cost: () => kill_reward_costs[shop_items.kill_reward.current_level],
    effect: () => {
      kill_reward = kill_reward_values[shop_items.kill_reward.current_level];
    },
  },
};

//상점 업그레이드 코인 가격
const bullet_power_costs = [10, 50, 150, 300, 500, 800, 1200, 2000, 3000, 5000];
const bullet_speed_costs = [5, 10, 20, 30, 45, 70, 100, 150, 200, 300];
const fire_rate_costs = [30, 100, 300, 700, 1200, 2000, 3500, 5500, 7500, 10000];
const ricochet_costs = [100, 500, 1000, 3000, 5000];
const kill_reward_costs = [25, 50, 150, 250, 500, 1000, 1500, 2500, 4000, 6000];
const pierce_costs = [100, 250, 500, 1500, 3000];

//상점 업그레이드 효과
const bullet_power_values = [1, 2, 3.5, 5.5, 8, 12, 18, 25, 35, 45, 60];
const bullet_speed_values = [10, 14, 18, 22, 26, 30];
const fire_rate_values = [600, 560, 520, 480, 440, 400, 360, 320, 280, 240, 200];
const ricochet_values = [0, 1, 2, 3, 5, 7];
const kill_reward_values = [10, 50, 100, 175, 250, 350, 450, 550, 700, 850, 1000];
const pierce_values = [0, 1, 2, 3, 5, 7];

// Get references to the shop elements from HTML
const shop_button = document.getElementById("shop_button");
const shop_modal = document.getElementById("shop_modal");
const close_shop_button = document.getElementById("close_shop_button");
const coin_display = document.getElementById("coin_display");
const shop_items_container = document.getElementById("shop_items");

// Update shop display
function update_shop_display() {
  coin_display.textContent = coins;
  shop_items_container.innerHTML = "";

  for (const key in shop_items) {
    const item = shop_items[key];
    const level = item.current_level;
    const max_level = item.max_level;
    const is_maxed = level >= max_level;
    const cost = is_maxed ? null : item.get_cost();

    const item_element = document.createElement("div");
    item_element.className = "shop-item";

    item_element.innerHTML = `
      <h3>${item.name}</h3>
      <p>Level: ${level}/${max_level}</p>
      <p>${get_item_effect_description(key)}</p>
      <button class="buy_button" data-item="${key}" 
        ${is_maxed || coins < cost ? "disabled" : ""}>
        ${is_maxed ? "MAXED" : `Upgrade (${cost} coins)`}
      </button>
    `;

    shop_items_container.appendChild(item_element);
  }

  document.querySelectorAll(".buy_button").forEach(function (button) {
    button.addEventListener("click", function () {
      const item_key = this.getAttribute("data-item");
      buy_upgrade(item_key);
    });
  });
}

function get_item_effect_description(key) {
  const item = shop_items[key];
  const level = item.current_level;

  switch (key) {
    case "bullet_power":
      return `Bullet damage<br>${bullet_power_values[level]} → ${bullet_power_values[level + 1]}`;
    case "bullet_speed":
      return `Bullet speed<br>${bullet_speed_values[level]} → ${bullet_speed_values[level + 1]}`;
    case "fire_rate":
      return `Fire rate<br>${fire_rate_values[level]}ms → ${fire_rate_values[level + 1]}ms`;
    case "ricochet":
      return `Ricochets<br>${ricochet_values[level]} → ${ricochet_values[level + 1]}`;
    case "kill_reward":
      return `Kill reward<br>${kill_reward_values[level]} → ${kill_reward_values[level + 1]}`;
    case "pierce":
      return `Pierce through<br>${pierce_values[level]} → ${pierce_values[level + 1]} enemies`;
    default:
      return "";
  }
}

function buy_upgrade(item_key) {
  const item = shop_items[item_key];
  const cost = item.get_cost();

  if (coins >= cost && item.current_level < item.max_level) {
    coins -= cost;
    item.current_level++;
    item.effect();
    update_shop_display();
    save_game_data();
  }
}

// Shop button events
shop_button.addEventListener("click", () => {
  shop_modal.style.display = "block";
  update_shop_display();
});

close_shop_button.addEventListener("click", () => {
  shop_modal.style.display = "none";
});

// Add coins based on score
let coins_from_score = 0;

function update_coins() {
  const new_coins_from_score = Math.floor(score / 10);

  if (new_coins_from_score > coins_from_score) {
    coins_from_score = new_coins_from_score;
  }

  coin_display.textContent = coins + coins_from_score;
}

// Show/hide shop button based on game state
function update_shop_visibility() {
  if (is_block(start_btn)) {
    shop_button.style.display = "block";
  } else {
    shop_button.style.display = "none";
    shop_modal.style.display = "none";
  }
}

// Load from localStorage
function load_game_data() {
  const saved_data = localStorage.getItem("dodgeboxSave");
  if (saved_data) {
    const data = JSON.parse(saved_data);
    coins = data.coins || 0;
    coin_display.textContent = coins;

    for (const key in shop_items) {
      if (data.shop_items && data.shop_items[key]) {
        shop_items[key].current_level = data.shop_items[key].current_level;
        shop_items[key].effect();
      }
    }
  }
}

// Save to localStorage
function save_game_data() {
  const save_data = {
    coins,
    shop_items: {},
  };

  for (const key in shop_items) {
    save_data.shop_items[key] = {
      current_level: shop_items[key].current_level,
    };
  }

  localStorage.setItem("dodgeboxSave", JSON.stringify(save_data));
}

update_shop_visibility();
