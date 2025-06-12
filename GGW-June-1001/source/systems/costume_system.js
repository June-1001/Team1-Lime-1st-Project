import { player_costumes } from "../entities/player_costumes.js";

//--------------------------------//
// 코스튬 기능 창 UI HTML 생성 함수 //
//--------------------------------//

export function update_costume_display(player) {
  let container = document.getElementById("costume_container");
  container.innerHTML = "";

  for (let id in player_costumes) {
    let costume = player_costumes[id];
    let wrapper = document.createElement("div");
    wrapper.className = "costume_wrapper";
    wrapper.setAttribute("data-id", id);

    if (!costume.unlocked) {
      wrapper.classList.add("disabled");
    }

    let name_element = document.createElement("div");
    name_element.className = "costume_name";
    name_element.textContent = costume.name;

    if (Number(id) === player.current_costume) {
      wrapper.classList.add("selected");
      name_element.textContent += " (적용중)";
    }

    wrapper.addEventListener("click", function () {
      if (!costume.unlocked) {
        return;
      }

      player.set_costume(Number(id));

      let all_wrappers = container.querySelectorAll(".costume_wrapper");
      for (let w of all_wrappers) {
        w.classList.remove("selected");

        let name_div = w.querySelector(".costume_name");
        if (name_div) {
          name_div.textContent = name_div.textContent.replace(" (적용중)", "");
        }
      }

      wrapper.classList.add("selected");
      name_element.textContent = costume.name + " (적용중)";
    });

    let canvas = document.createElement("canvas");
    canvas.className = "costume_canvas";
    canvas.width = 100;
    canvas.height = 100;
    let ctx = canvas.getContext("2d");
    costume.draw(ctx, canvas.width / 2, canvas.height / 2, 20);

    let spacer = document.createElement("div");
    spacer.className = "costume_spacer";

    let description_element = document.createElement("div");
    description_element.className = "costume_description";
    description_element.textContent = costume.description;

    wrapper.appendChild(canvas);
    wrapper.appendChild(spacer);
    wrapper.appendChild(name_element);
    wrapper.appendChild(description_element);

    container.appendChild(wrapper);
  }
}
