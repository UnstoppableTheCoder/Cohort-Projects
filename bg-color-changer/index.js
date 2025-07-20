// Pre Saved Colors
const colors = [
  {
    name: "Black",
    colorCode: "#000000",
  },
  {
    name: "Red",
    colorCode: "red",
  },
  {
    name: "Yellow",
    colorCode: "yellow",
  },
  {
    name: "Blue",
    colorCode: "blue",
  },
];

const colorContainer = document.querySelector("#color-container");

renderColor();

// renderColor()
function renderColor() {
  colorContainer.innerHTML = `
      <div class="color add-btn" id="input-render-btn">Add</div>
      <div class="color-input-container" id="color_input_container">
        <label class="input-label">
          Color Name &nbsp;
          <input type="text" id="name-input" />
        </label>
        <label class="input-label">
          Color&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <input type="color" id="color-input" />
        </label>
        <button class="add-input-btn" id="color_add_btn">Add Color</button>
      </div>
  `;

  // Map all the color & append
  colors.map((color, index) => {
    const colorDiv = document.createElement("div");
    colorDiv.innerText = color.name;
    colorDiv.classList.add("color");
    colorDiv.style.backgroundColor = color.colorCode;
    colorDiv.style.color = color.name === "Black" ? "white" : "black";
    colorDiv.setAttribute("data-id", `${index}`);

    colorDiv.addEventListener("click", function () {
      document.querySelector(".prevBtn")?.classList.remove("scale", "prevBtn");
      colorDiv.classList.add("scale", "prevBtn");
      document.body.style.backgroundColor = color.colorCode;
    });

    colorContainer.append(colorDiv);
  });

  const inputRenderBtn = document.querySelector("#input-render-btn");
  const nameInput = document.querySelector("#name-input");
  const colorInput = document.querySelector("#color-input");
  const colorAddBtn = document.querySelector("#color_add_btn");
  const colorInputContainer = document.querySelector("#color_input_container");

  // render colorInputContainer
  inputRenderBtn.addEventListener("click", () => {
    colorInputContainer.classList.toggle("visible");
    console.log("add");
  });

  // add the color to the array
  colorAddBtn?.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const colorCode = colorInput.value;

    colorInputContainer.classList.remove("visible");
    colors.push({ name, colorCode });
    renderColor();
  });
}
