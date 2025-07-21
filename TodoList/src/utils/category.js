import { setSecondaryOptionName } from "../scripts/category.js";

// renderCategory()
export function renderCategories(
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  categoriesContainer.innerHTML = "";
  allCategories.map((category, index) => {
    const allTodos = todos.filter((t) => t.category === category.id);
    const todosDone = allTodos.filter((t) => t.isDone === true);

    const categoryContainer = document.createElement("a");
    categoryContainer.classList.add(
      "px-5",
      "pb-5",
      "bg-gray-600",
      "rounded-lg",
      "space-y-3",
      "cursor-pointer",
      "hover:bg-gray-700",
      "transition",
      "duration-200",
      "relative"
    );

    categoryContainer.addEventListener("click", function (event) {
      event.stopPropagation();
      selectCategory(category.id, state, saveToLocalStorage);
      window.location.href = "todo.html";
    });

    const h2Element = document.createElement("h2");
    const firstP = document.createElement("p");
    const secondP = document.createElement("p");
    const btnsContainer = document.createElement("div");
    const editBtnContainer = document.createElement("div");
    const deleteBtn = document.createElement("button");
    const checkMarkElement = document.createElement("div");

    // Changing UI (CheckMark & Done) and saving everything to LocalStorage
    if (todosDone.length !== 0 && todosDone.length === allTodos.length) {
      categoryContainer.classList.add("bg-gray-700");
      checkMarkElement.innerText = "✅";
      checkMarkElement.classList.add(
        "absolute",
        "text-4xl",
        "top-1",
        "right-1"
      );
      secondP.classList.add("font-bold", "text-green-400");

      allCategories[index].isDone = true;
    } else {
      allCategories[index].isDone = false;
    }

    h2Element.innerText = category.icon;
    h2Element.classList.add("text-4xl", "mt-0");

    firstP.innerText = category.name;
    firstP.classList.add("text-xl");
    secondP.innerText = `${todosDone.length || 0} / ${allTodos.length} Done`;

    editBtnContainer.innerHTML = `
    <button class="btn btn-sm btn-primary absolute top-5 right-5 px-5 sm:static" id="edit_category_btn${index}">
        Edit
      </button>
      <dialog id="edit_category_dialog${index}" class="modal">
        <div class="modal-box space-y-5">
          <h2 class="font-bold text-center text-xl">Edit Category</h2>
          <div class="w-full">
            <span>Name:</span>
            <input
              type="text"
              class="input focus:outline-none focus:ring-0 focus:border-gray-500 w-full"
              id="edit_category_input${index}"
              placeholder="Edit category..."
            />
          </div>
          <div class="modal-action">
            <button class="btn" id="save_edited_category_btn${index}">Save</button>
            <form method="dialog">
              <button class="btn" id="edited_category_modal_cancel_btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    `;

    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add(
      "btn",
      "btn-sm",
      "btn-secondary",
      "absolute",
      "top-16",
      "right-5",
      "sm:static"
    );
    deleteBtn.setAttribute("data-id", index);

    btnsContainer.classList.add("flex", "gap-2", "items-center");
    btnsContainer.append(editBtnContainer, deleteBtn);

    categoryContainer.append(
      checkMarkElement,
      h2Element,
      firstP,
      secondP,
      btnsContainer
    );
    categoriesContainer.appendChild(categoryContainer);

    // Edit category elements
    const editCategoryBtn = document.querySelector(
      "#edit_category_btn" + index
    );
    const editCategoryDialog = document.querySelector(
      "#edit_category_dialog" + index
    );
    const editCategoryInput = document.querySelector(
      "#edit_category_input" + index
    );
    const saveEditedCategoryBtn = document.querySelector(
      "#save_edited_category_btn" + index
    );

    // editCategoryBtn
    editCategoryBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      editCategoryDialog.showModal();
      editCategoryInput.value = category.name;
    });

    // editCategoryDialog
    editCategoryDialog.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // SaveEditedCategoryBtn
    saveEditedCategoryBtn.addEventListener("click", () => {
      saveEditedCategory(
        editCategoryInput,
        allCategories,
        categoriesContainer,
        todos,
        state,
        index,
        renderCategories,
        saveToLocalStorage
      );
    });

    // deleteBtn
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      todos = todos.filter((t) => t.category !== category.id);
      allCategories.splice(index, 1);
      saveToLocalStorage("todos", todos);
      saveToLocalStorage("categories", allCategories);
      renderCategories(
        categoriesContainer,
        allCategories,
        todos,
        state,
        saveToLocalStorage
      );
    });

    // Save edited Category when clicked Enter
    editCategoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveEditedCategory(
          editCategoryInput,
          allCategories,
          categoriesContainer,
          todos,
          state,
          index,
          renderCategories,
          saveToLocalStorage
        );
      }
    });
  });
}

// selectCategory() - when clicked
export function selectCategory(id, state, saveToLocalStorage) {
  state.selectedCategory = id;
  saveToLocalStorage("state", state);
}

// addCategory()
export function addCategory(
  id,
  createCategoryInput,
  categoryModalCancelBtn,
  categoriesContainer,
  icons,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  const categoryName = createCategoryInput.value;
  createCategoryInput.value = "";
  categoryModalCancelBtn.click();

  const newCategory = {
    id: id,
    name: categoryName,
    icon: icons[Math.floor(Math.random() * icons.length)],
    createdAt: new Date().toISOString(),
    isDone: false,
  };

  allCategories.push(newCategory);
  saveToLocalStorage("categories", allCategories);
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// saveEditedCategory()
function saveEditedCategory(
  editCategoryInput,
  allCategories,
  categoriesContainer,
  todos,
  state,
  index,
  renderCategories,
  saveToLocalStorage
) {
  const categoryName = editCategoryInput.value;
  editCategoryInput.value = "";
  allCategories[index].name = categoryName;

  saveToLocalStorage("categories", allCategories);
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// normalizeColorOfPrevSortOpt()
export function normalizeColorOfPrevSortOpt(
  primaryOptionName,
  secondaryOptionName
) {
  secondaryOptionName = secondaryOptionName ? secondaryOptionName : "asc";
  // Normalizing the color of previous clicked sort option
  if (primaryOptionName) {
    document
      .querySelector("#primary_option_" + primaryOptionName)
      .classList.remove("bg-primary");
  }

  // Normalizing the color of previous clicked sort option
  if (secondaryOptionName) {
    document
      .querySelector("#secondary_option_" + secondaryOptionName)
      ?.classList?.remove("bg-primary");
  }
}

// sortCategories()
export function sortCategories(
  primaryOptionName,
  secondaryOptionName,
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  if (primaryOptionName && !secondaryOptionName) {
    switch (primaryOptionName) {
      case "name":
        sortByName(
          "asc",
          categoriesContainer,
          allCategories,
          todos,
          state,
          saveToLocalStorage
        );
        break;

      case "date":
        sortByDate(
          "asc",
          categoriesContainer,
          allCategories,
          todos,
          state,
          saveToLocalStorage
        );
        break;

      case "done":
        sortByDone(
          "asc",
          categoriesContainer,
          allCategories,
          todos,
          state,
          saveToLocalStorage
        );
        break;

      default:
        break;
    }
  } else if (primaryOptionName && secondaryOptionName) {
    switch (secondaryOptionName) {
      case "asc":
        if (primaryOptionName === "name") {
          sortByName(
            "asc",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "date") {
          sortByDate(
            "asc",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "done") {
          sortByDone(
            "asc",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        }
        break;

      case "des":
        if (primaryOptionName === "name") {
          sortByName(
            "des",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "date") {
          sortByDate(
            "des",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "done") {
          sortByDone(
            "des",
            categoriesContainer,
            allCategories,
            todos,
            state,
            saveToLocalStorage
          );
        }
        break;

      case "reset":
        resetCategories(
          categoriesContainer,
          allCategories,
          todos,
          state,
          saveToLocalStorage
        );
        break;

      default:
        break;
    }
  }
}

// setColorToSortOpt()
export function setColorToSortOpt(primaryOptionName, secondaryOptionName) {
  let tempSecondaryOptionName;
  if (primaryOptionName) {
    if (secondaryOptionName === "des") {
      tempSecondaryOptionName = "des";
    } else if (secondaryOptionName !== "des") {
      tempSecondaryOptionName = "asc";
    }
  }

  const primaryOptionElement = document.querySelector(
    "#primary_option_" + primaryOptionName
  );
  const secondaryOptionElement = document.querySelector(
    "#secondary_option_" + tempSecondaryOptionName
  );

  if (secondaryOptionName !== "reset") {
    if (primaryOptionElement) {
      primaryOptionElement?.classList?.add("bg-primary");
    }

    if (secondaryOptionElement) {
      secondaryOptionElement?.classList?.add("bg-primary");
    }
  }

  if (secondaryOptionName === "reset") {
    setSecondaryOptionName("");
  }
}

// sortByName()
function sortByName(
  type,
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  if (type == "asc") {
    allCategories = [...allCategories].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (type == "des") {
    allCategories = [...allCategories].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// sortByDate()
function sortByDate(
  type,
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  if (type == "asc") {
    allCategories = [...allCategories].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (type == "des") {
    allCategories = [...allCategories].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// sortByDone()
function sortByDone(
  type,
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  if (type == "des") {
    allCategories = [...allCategories].sort((a, b) => a.isDone - b.isDone);
  } else if (type == "asc") {
    allCategories = [...allCategories].sort((a, b) => b.isDone - a.isDone);
  }

  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// resetTodos()
function resetCategories(
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
) {
  console.log("All: ", allCategories);
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}

// searchTodos()
export function searchCategories(
  searchInput,
  allCategories,
  categoriesContainer,
  todos,
  state,
  saveToLocalStorage
) {
  allCategories = allCategories.filter((category) =>
    category.name?.toLowerCase().includes(searchInput?.toLowerCase())
  );
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
}
