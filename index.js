document.addEventListener("DOMContentLoaded", () => {
  //여기에 game.html 대신 본인 게임 html 이름 입력
  const URL_map = {
    "June-1001": "GGW-June-1001/dodgebox_game.html",
    thsaudgh8: "SMH-thsaudgh8/main.html ",
    KHS25: "KHS-KHS25/fly_hunter_game.html",
    DODOVX: "CJH-DODOVX/index.html",
  };

  // title 부분에 각자 게임 타이틀 입력
  const team_members = [
    { name: "고건우", id: "June-1001", title: "Dodgebox", thumbnail: "dodgebox.jpg" },
    {
      name: "손명호",
      id: "thsaudgh8",
      title: "Simple Aimlab",
      thumbnail: "simple_aimlab.png",
    },
    { name: "권혜숙", id: "KHS25", title: "파리잡기 게임", thumbnail: "fly_hunter_game.png" },
    { name: "최전호", id: "DODOVX", title: "Nonograms", thumbnail: "nonograms.png" },
  ];

  const container = document.getElementById("teamContainer");

  team_members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "card";

    const thumbnail_img = `./thumbnail/${member.thumbnail}`;
    const temp_thumbnail = "thumbnail/temp.png";

    card.innerHTML = `
            <img src="${thumbnail_img}" alt="${member.name}" class="card-img" onerror="this.src='${temp_thumbnail}'">
            <div class="card-body">
                <div class="game-title">${member.title}</div>
                <div class="member-name"><span lang="ko">${member.name}</span> / ${member.id}</div>
                <button class="play-game" data-name="${member.id}">Play Game</button>
            </div>
        `;

    container.appendChild(card);
  });

  document.querySelectorAll(".play-game").forEach((button) => {
    button.addEventListener("click", () => {
      const fileURL = URL_map[button.getAttribute("data-name")];
      window.open(fileURL, "_blank");
    });
  });
});
