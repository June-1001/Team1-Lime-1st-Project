//--------------------//
// 무지개 전용 색깔 맵 //
//--------------------//

export const costume_rainbow_colors = [
  "rgba(231, 52, 52, 0.9)",
  "rgba(237, 88, 44, 0.9)",
  "rgba(236, 112, 36, 0.9)",
  "rgba(236, 136, 32, 0.9)",
  "rgba(239, 165, 26, 0.9)",
  "rgba(241, 186, 20, 0.9)",
  "rgba(224, 199, 35, 0.9)",
  "rgba(145, 194, 65, 0.9)",
  "rgba(75, 184, 94, 0.9)",
  "rgba(31, 177, 122, 0.9)",
  "rgba(0, 174, 150, 0.9)",
  "rgba(10, 160, 174, 0.9)",
  "rgba(39, 145, 198, 0.9)",
  "rgba(68, 130, 223, 0.9)",
  "rgba(104, 116, 230, 0.9)",
  "rgba(130, 101, 222, 0.9)",
  "rgba(145, 94, 205, 0.9)",
  "rgba(153, 91, 194, 0.9)",
  "rgba(156, 90, 188, 0.9)",
  "rgba(157, 89, 185, 0.9)",
  "rgba(157, 89, 182, 0.9)",
  "rgba(157, 89, 182, 0.9)",
  "rgba(166, 78, 163, 0.9)",
  "rgba(182, 66, 140, 0.9)",
  "rgba(198, 59, 117, 0.9)",
  "rgba(213, 55, 95, 0.9)",
  "rgba(224, 53, 72, 0.9)",
  "rgba(231, 52, 52, 0.9)",
];

//---------------------------//
// 여기에 플레이어 코스튬 추가 //
//---------------------------//

export const player_costumes = {
  0: {
    unlocked: true,
    name: "기본 코스튬",
    description: "기본 코스튬",
    color: "rgba(255,255,255,0.6)",
    shadow_color: "rgba(255,255,255,0.3)",

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
    name: "무지개",
    description: " ",
    color: "rgba(231, 52, 52, 0.9)",
    shadow_color: "rgba(231, 52, 52, 0.3)",
    color_index: 0,

    draw: function (ctx, x, y, radius) {
      this.color_index = (this.color_index + 1) % costume_rainbow_colors.length;
      const current_color = costume_rainbow_colors[Math.floor(this.color_index)];

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = current_color.replace("0.9", "0.3");
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = current_color;
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      const trail_color_index = (this.color_index + 1) % costume_rainbow_colors.length;
      const trail_color = costume_rainbow_colors[Math.floor(trail_color_index)];

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
