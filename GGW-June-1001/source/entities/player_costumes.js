// src/player/costumes.js

export const player_costumes = {
  0: {
    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();
      ctx.restore();
    },
  },

  1: {
    draw: function (ctx, x, y, radius) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(0,255,255,0.4)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
      ctx.fillStyle = "rgba(0,255,255,0.6)";
      ctx.fill();
      ctx.restore();
    },

    trail_draw: function (ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(0,255,255,0.2)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
      ctx.fillStyle = "rgba(0,255,255,0.3)";
      ctx.fill();
      ctx.restore();
    },
  },

  // Add more...
};
