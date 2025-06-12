//--------------------//
// 무지개 전용 색깔 맵 //
//--------------------//

export const costume_rainbow_colors = [
  "rgba(231, 52, 52, 1)",
  "rgba(237, 88, 44, 1)",
  "rgba(236, 112, 36, 1)",
  "rgba(236, 136, 32, 1)",
  "rgba(239, 165, 26, 1)",
  "rgba(241, 186, 20, 1)",
  "rgba(224, 199, 35, 1)",
  "rgba(145, 194, 65, 1)",
  "rgba(75, 184, 94, 1)",
  "rgba(31, 177, 122, 1)",
  "rgba(0, 174, 150, 1)",
  "rgba(10, 160, 174, 1)",
  "rgba(39, 145, 198, 1)",
  "rgba(68, 130, 223, 1)",
  "rgba(104, 116, 230, 1)",
  "rgba(130, 101, 222, 1)",
  "rgba(145, 94, 205, 1)",
  "rgba(153, 91, 194, 1)",
  "rgba(156, 90, 188, 1)",
  "rgba(157, 89, 185, 1)",
  "rgba(157, 89, 182, 1)",
  "rgba(157, 89, 182, 1)",
  "rgba(166, 78, 163, 1)",
  "rgba(182, 66, 140, 1)",
  "rgba(198, 59, 117, 1)",
  "rgba(213, 55, 95, 1)",
  "rgba(224, 53, 72, 1)",
  "rgba(231, 52, 52, 1)",
];

//---------------------------//
// 여기에 플레이어 코스튬 추가 //
//---------------------------//

export const player_costumes = {
  0: {
    unlocked: true,
    name: "기본 코스튬",
    description: "기본 코스튬",
    color: "rgba(255,255,255,1)",
    shadow_color: "rgba(255,255,255,0.3)",
    radius: 18,
    speed: 9,

    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },
  },

  1: {
    unlocked: true,
    name: "빨강",
    description: "3배 빨라집니다",
    color: "rgba(255, 50, 50, 1)",
    shadow_color: "rgba(255, 50, 50, 0.3)",
    radius: 18,
    speed: 27,

    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },
  },

  2: {
    unlocked: false,
    name: "황금",
    description: "100,000 코인 이상<br>획득 시 해금",
    color: "rgba(255, 215, 0, 1)",
    shadow_color: "rgba(255, 215, 0, 0.4)",
    radius: 18,
    speed: 9,

    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },
  },

  3: {
    unlocked: false,
    name: "유령",
    description: "적이 20명 이상 있을 때<br>생존 시 해금",
    color: "rgba(200, 200, 255, 0.1)",
    shadow_color: "rgba(200, 200, 255, 0.1)",
    radius: 18,
    speed: 9,

    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.3;
      ctx.shadowColor = this.shadow_color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    },
  },

  4: {
    unlocked: false,
    name: "3D",
    description: "300,000점 이상<br>획득 시 해금",
    color: "rgb(151, 151, 151)",
    shadow_color: "rgba(0, 0, 0, 0.5)",
    radius: 18,
    speed: 9,

    draw: function (ctx, x, y, radius) {
      ctx.save();

      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;

      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      const gradient = ctx.createRadialGradient(
        x - radius / 3,
        y - radius / 3,
        radius / 6,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.8, this.color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();

      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;

      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const gradient = ctx.createRadialGradient(
        x - radius / 4,
        y - radius / 4,
        radius / 8,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(1, this.color);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },
  },

  5: {
    unlocked: false,
    name: "무지개",
    description: "777,777점 이상<br>획득 시 해금",
    color: "rgba(231, 52, 52, 1)",
    shadow_color: "rgba(231, 52, 52, 0.3)",
    color_index: 0,
    radius: 18,
    speed: 9,

    draw: function (ctx, x, y, radius) {
      this.color_index = (this.color_index + 1) % costume_rainbow_colors.length;
      const current_color = costume_rainbow_colors[Math.floor(this.color_index)];

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = current_color.replace("1", "0.3");
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = current_color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      const trail_color_index = (this.color_index + 1) % costume_rainbow_colors.length;
      const trail_color = costume_rainbow_colors[trail_color_index];

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = trail_color.replace("0.9", "0.1");
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = trail_color;
      ctx.fill();
      ctx.restore();
    },
  },
};
