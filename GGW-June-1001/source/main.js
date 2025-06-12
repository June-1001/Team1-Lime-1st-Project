import { init_input } from "./core/input.js";
import {
  game_area_width,
  game_area_height,
  game_update_rate,
  my_game_area,
  pause_game,
  resume_game,
  is_game_active,
} from "./core/game_core.js";
import {
  game_running,
  set_game_running,
  reset_score,
  increment_score,
  get_score,
  reset_difficulty,
  get_coins_from_score,
  add_score,
} from "./core/game_state.js";
import {
  game_container,
  start_btn,
  restart_btn,
  comment_start,
  comment_restart,
  score_display,
  final_score_display,
  center_overlay,
  video,
  shop_button,
  shop_modal,
  help_button,
  help_modal,
  costume_button,
  costume_modal,
  is_block,
  show_div,
  update_coin_display,
  init_ui_event_listeners,
  update_game_over_display,
  display_check_all,
} from "./UI/game_ui.js";
import { player } from "./entities/player.js";
import {
  obstacles,
  update_spawn_timers,
  reset_spawn_system,
  update_floating_texts,
  add_floating_text,
} from "./systems/spawn_system.js";
import { bullets, update_bullets, fire_bullet, reset_bullets } from "./systems/bullet_system.js";
import {
  shop_items,
  update_shop_display,
  buy_upgrade,
  load_game_data,
  save_game_data,
  update_coins_based_on_score,
  add_coins,
  all_maxed,
  reset_shop_data,
  check_all_shop_items_maxed,
  notice_seen,
} from "./systems/shop_system.js";
import { update_costume_display } from "./systems/costume_system.js";

export { game_container };

let game_update_interval_id;

init_input(game_container);

init_ui_event_listeners(
  start_game,
  restart_game,
  function (event) {
    switch (event.target) {
      case shop_button: {
        shop_modal.style.display = "block";
        help_modal.style.display = "none";
        costume_modal.style.display = "none";
        update_shop_display();
        break;
      }
      case help_button: {
        shop_modal.style.display = "none";
        help_modal.style.display = "block";
        costume_modal.style.display = "none";
        break;
      }
      case costume_button: {
        shop_modal.style.display = "none";
        help_modal.style.display = "none";
        costume_modal.style.display = "block";
        update_costume_display(player);
        break;
      }
    }
  },
  function () {
    shop_modal.style.display = "none";
    help_modal.style.display = "none";
    costume_modal.style.display = "none";
  }
);

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

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    pause_game(game_update_interval_id, video);
  } else {
    resume_game(start_game_update_loop, game_running, video);
  }
});

window.addEventListener("blur", function () {
  pause_game(game_update_interval_id, video);
});
window.addEventListener("focus", function () {
  resume_game(start_game_update_loop, game_running, video);
});

function start_game_update_loop() {
  clearInterval(game_update_interval_id);
  game_update_interval_id = setInterval(update_game_area, game_update_rate);
}

function start_game() {
  clearInterval(game_update_interval_id);

  start_btn.style.display = "none";
  center_overlay.style.display = "none";
  display_check_all(all_maxed);

  reset_spawn_system();
  player.reset_trail();
  reset_bullets();
  reset_score();
  reset_difficulty();
  set_game_running(true);

  score_display.textContent = `점수: ${get_score()}`;
  my_game_area.start();

  video.style.display = "block";
  video.play();

  start_game_update_loop();
}

function update_game_area() {
  my_game_area.clear();
  if (!game_running) return;

  increment_score();
  score_display.textContent = `점수: ${get_score()}`;
  update_coins_based_on_score();

  player.move();
  player.update();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].move();
    obstacles[i].update();
  }

  update_spawn_timers();

  fire_bullet();
  update_bullets();

  update_floating_texts();

  check_collisions();
}

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

function game_over() {
  set_game_running(false);
  center_overlay.style.display = "block";
  score_display.textContent = "";
  update_game_over_display(get_score(), get_coins_from_score());
  show_div(comment_start, start_btn);
  show_div(comment_restart, center_overlay);
  clearInterval(game_update_interval_id);

  add_coins(get_coins_from_score());

  reset_spawn_system();
  player.reset_trail();
  reset_bullets();
  reset_score();
  reset_difficulty();
  my_game_area.clear();

  save_game_data();
}

function restart_game() {
  center_overlay.style.display = "none";
  start_btn.style.display = "block";
  score_display.textContent = "";
  set_game_running(false);
  video.pause();
  video.style.display = "none";
  display_check_all(all_maxed);
}

window.addEventListener("load", () => {
  load_game_data();
  check_all_shop_items_maxed();
  display_check_all(all_maxed);
});
