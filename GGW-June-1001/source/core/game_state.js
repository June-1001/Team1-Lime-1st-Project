export let game_running = false;
export let score = 0;
export let score_counter = 0;
export let difficulty = 0;
export let coins_from_score = 0;

export function set_game_running(value) {
  game_running = value;
}

export function reset_score() {
  score = 0;
  score_counter = 0;
  coins_from_score = 0;
}

export function increase_score() {
  score_counter++;
  if (score_counter >= 5) {
    score++;
    score_counter = 0;
    update_coins_from_score();
  }
}

export function add_score(amount) {
  score += amount;
  update_coins_from_score();
}

function update_coins_from_score() {
  const new_coins_from_score = Math.floor(score / 10);
  if (new_coins_from_score > coins_from_score) {
    coins_from_score = new_coins_from_score;
  }
}

export function reset_difficulty() {
  difficulty = 0;
}

export function increase_difficulty() {
  difficulty += 1;
}

export function get_score() {
  return score;
}
export function get_difficulty() {
  return difficulty;
}
export function get_coins_from_score() {
  return coins_from_score;
}
