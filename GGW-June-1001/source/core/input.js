export const keys = {
  arrow_up: false,
  arrow_down: false,
  arrow_left: false,
  arrow_right: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

export let cursor_x = 0;
export let cursor_y = 0;

export function init_input(game_container) {
  function handle_key_down(event) {
    if (keys.hasOwnProperty(event.key.toLowerCase())) {
      keys[event.key.toLowerCase()] = true;
    }
  }
  function handle_key_up(event) {
    if (keys.hasOwnProperty(event.key.toLowerCase())) {
      keys[event.key.toLowerCase()] = false;
    }
  }
  document.addEventListener("keydown", handle_key_down);
  document.addEventListener("keyup", handle_key_up);

  game_container.addEventListener("mousemove", (e) => {
    const rect = game_container.getBoundingClientRect();
    cursor_x = e.clientX - rect.left;
    cursor_y = e.clientY - rect.top;
  });
}
