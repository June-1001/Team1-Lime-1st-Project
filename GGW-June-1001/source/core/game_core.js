import { game_container } from "../main.js";
import { reset_keys } from "./input.js";

//-----------------//
// 게임 캔버스 설정 //
//-----------------//

export const game_area_width = 900;
export const game_area_height = 720;
export const game_update_rate = 20;

export const my_game_area = {
  canvas: document.createElement("canvas"),
  context: null,
  start: function () {
    this.canvas.width = game_area_width;
    this.canvas.height = game_area_height;
    this.context = this.canvas.getContext("2d");
    if (!this.canvas.parentElement) {
      game_container.appendChild(this.canvas);
    }
  },
  clear: function () {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },
};

//-----------------//
// 게임 활성화 제어 //
//-----------------//

export let is_game_active = true;

export function pause_game(game_update_interval_id, video_element) {
  clearInterval(game_update_interval_id);
  if (video_element) {
    video_element.pause();
  }
  is_game_active = false;
}

export function resume_game(start_update_callback, game_running, video_element) {
  if (!is_game_active && game_running) {
    start_update_callback();
    if (video_element) {
      video_element.play();
    }
    is_game_active = true;
    reset_keys();
  }
}

//-------------------------//
// 게임 데이터 세이브 / 로드 //
//-------------------------//

// 세이브할 데이터 목록
// 코인, 코스튬 기능 해금 여부, 상점 업그레이드, 해금한 코스튬
export function save_game_data() {
  const save_data = {
    coins,
    notice_seen,
    all_maxed,
    shop_items: {},
    player_costumes_unlocked: {},
  };

  for (const key in shop_items) {
    save_data.shop_items[key] = {
      current_level: shop_items[key].current_level,
    };
  }

  for (const key in player_costumes) {
    save_data.player_costumes_unlocked[key] = player_costumes[key].unlocked;
  }

  localStorage.setItem("dodgebox_save", JSON.stringify(save_data));
}

export function load_game_data() {
  const saved_data = localStorage.getItem("dodgebox_save");
  if (saved_data) {
    const data = JSON.parse(saved_data);
    coins = data.coins || 0;

    notice_seen = !!data.notice_seen;
    all_maxed = !!data.all_maxed;

    for (const key in shop_items) {
      if (data.shop_items && data.shop_items[key]) {
        shop_items[key].current_level = data.shop_items[key].current_level;
        shop_items[key].effect();
      }
    }

    if (data.player_costumes_unlocked) {
      for (const key in player_costumes) {
        if (key in data.player_costumes_unlocked) {
          player_costumes[key].unlocked = data.player_costumes_unlocked[key];
        }
      }
    }
  }

  update_shop_display();
  check_all_shop_items_maxed();
}

//----------------//
// 리셋 (테스트용) //
//----------------//

export function reset_shop_data() {
  coins = 0;
  notice_seen = false;
  all_maxed = false;

  for (const key in shop_items) {
    shop_items[key].current_level = 0;
    shop_items[key].effect();
  }

  for (const key in player_costumes) {
    player_costumes[key].unlocked = key === "0" || key === "1";
  }

  save_game_data();
}
