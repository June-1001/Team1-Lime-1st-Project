export const game_container = document.getElementById("game_container");
export const start_btn = document.getElementById("start_button");
export const restart_btn = document.getElementById("restart_button");
export const comment_start = document.getElementById("comment_start");
export const comment_restart = document.getElementById("comment_restart");
export const score_display = document.getElementById("score_display");
export const final_score_display = document.getElementById("final_score");
export const center_overlay = document.getElementById("center_overlay");
export const video = document.getElementById("background_video");
export const shop_button = document.getElementById("shop_button");
export const shop_modal = document.getElementById("shop_modal");
export const close_shop_button = document.getElementById("close_shop");

export const help_button = document.getElementById("help_button");
export const help_modal = document.getElementById("help_modal");
export const close_help_button = document.getElementById("close_help");

export const costume_button = document.getElementById("costume_button");
export const costume_modal = document.getElementById("costume_modal");
export const close_costume_button = document.getElementById("close_costume");

export const coin_display = document.getElementById("coin_display");
export const shop_items_container = document.getElementById("shop_items");

export function is_block(element) {
  return getComputedStyle(element).display === "block";
}

export function show_div(div, menu) {
  if (is_block(menu)) {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}

export function update_coin_display(total_coins, coins_from_score) {
  coin_display.textContent = total_coins + coins_from_score;
}

export function init_ui_event_listeners(
  start_game_callback,
  restart_game_callback,
  open_modal_callback,
  close_modal_callback
) {
  start_btn.addEventListener("click", start_game_callback);
  restart_btn.addEventListener("click", restart_game_callback);

  shop_button.addEventListener("click", open_modal_callback);
  close_shop_button.addEventListener("click", close_modal_callback);

  help_button.addEventListener("click", open_modal_callback);
  close_help_button.addEventListener("click", close_modal_callback);

  costume_button.addEventListener("click", open_modal_callback);
  close_costume_button.addEventListener("click", close_modal_callback);
}

export function update_game_over_display(score, coins_from_score) {
  final_score_display.innerHTML = `점수: ${score}<br><span style="font-size: 26px; text-shadow: 0 0 8px gold">획득 코인: ${coins_from_score}</span>`;
}

export function display_check_all(all_maxed) {
  show_div(shop_button, start_btn);
  show_div(help_button, start_btn);
  show_div(comment_start, start_btn);
  show_div(comment_restart, center_overlay);
  if (all_maxed) {
    show_div(costume_button, start_btn);
  } else {
    costume_button.style.display = "none";
  }
}
