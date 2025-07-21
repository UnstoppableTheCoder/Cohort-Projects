import { setSecondaryOptionName } from "../scripts/todo.js";

// getFilteredTodos()
export function getFilteredTodos(allTodos, selectedCategory) {
  let allTodosList = allTodos?.filter(
    (todo) => todo.category === selectedCategory
  );
  return allTodosList.map((todo) => ({ ...todo }));
}

// renderTodos()
export function renderTodos(
  todosContainer,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  todosContainer.innerHTML = "";
  filteredTodos?.forEach((todo, index) => {
    const todoDivElement = document.createElement("div");

    const todoElement = `
    <div class="card shadow-xl todo_card${index} ${
      todo.isDone ? "bg-gray-300/10 text-white/50" : "bg-gray-700"
    }" id="todo_card${index}" title="Double click to set todo done">
        <div class="card-body relative">
          <div class="flex justify-between">
            <div>
              <h2 class="card-title">${todo.name}</h2>
              <p>${todo.description}</p>
            </div>
            <div class="text-4xl text-white absolute right-1 top-1">
              ${todo.isDone ? "✅" : ""}
            </div>
          </div>
          <div class="card-actions justify-end">
            <button
              class="btn bg-primary btn-sm border-none"
              id="edit_todo_btn${index}"
              ${todo.isDone ? "disabled" : ""}
            >
              Edit Todo
            </button>
            <dialog id="edit_todo${index}" class="modal">
              <div class="modal-box space-y-5">
                <button class="font-bold text-center text-xl">Edit Todo</button>
                <div class="w-full">
                  <span class="">Name:</span> <br />
                  <input
                    type="text"
                    class="input focus:outline-none focus:ring-0 focus:border-gray-500 w-full"
                    id="edit_todo_name_input${index}"
                  />
                </div>
                <div>
                  <span class="">Description:</span> <br />
                  <input
                    type="text"
                    class="input focus:outline-none focus:ring-0 focus:border-gray-500 w-full"
                    id="edit_todo_description_input${index}"
                  />
                </div>
                <div class="modal-action">
                  <button class="btn" id="edit_todo_save_btn${index}">Save</button>
                  <form method="dialog">
                    <button class="btn" id="edit_modal_cancel_btn${index}">Cancel</button>
                  </form>
                </div>
              </div>
            </dialog>
            <button class="btn btn-sm btn-secondary" id="delete_todo_btn${index}" ${
      todo.isDone ? "disabled" : ""
    } >Delete</button>
          </div>
        </div>
      </div>
    `;

    todoDivElement.innerHTML = todoElement;
    todosContainer.append(todoDivElement);

    // Edit Todo Elements from DOM
    const editTodoNameInput = document.querySelector(
      "#edit_todo_name_input" + index
    );
    const editTodoDescriptionInput = document.querySelector(
      "#edit_todo_description_input" + index
    );
    const editTodoSaveBtn = document.querySelector(
      "#edit_todo_save_btn" + index
    );

    const editModalCancelBtn = document.querySelector(
      "#edit_modal_cancel_btn" + index
    );

    // editTodoBtn
    const editTodoBtn = document.querySelector(`#edit_todo_btn${index}`);
    const modal = document.querySelector("#edit_todo" + index);
    editTodoBtn.addEventListener("click", () => {
      modal.showModal();
      editTodo(editTodoNameInput, editTodoDescriptionInput, todo);
    });

    // deleteTodoBtn
    const deleteTodoBtn = document.querySelector("#delete_todo_btn" + index);
    deleteTodoBtn?.addEventListener("click", () => {
      deleteTodo(
        todo,
        allTodos,
        filteredTodos,
        renderTodos,
        todosContainer,
        saveToLocalStorage
      );
    });

    // editTodoSaveBtn
    editTodoSaveBtn?.addEventListener("click", () => {
      editModalCancelBtn.click();
      saveEditedTodo(
        todo,
        editTodoNameInput,
        editTodoDescriptionInput,
        filteredTodos,
        allTodos,
        renderTodos,
        todosContainer,
        saveToLocalStorage
      );
    });

    // save edited todo when clicked Enter
    editTodoNameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        saveEditedTodo(
          todo,
          editTodoNameInput,
          editTodoDescriptionInput,
          filteredTodos,
          allTodos,
          renderTodos,
          todosContainer,
          saveToLocalStorage
        );
      }
    });

    editTodoDescriptionInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        saveEditedTodo(
          todo,
          editTodoNameInput,
          editTodoDescriptionInput,
          filteredTodos,
          allTodos,
          renderTodos,
          todosContainer,
          saveToLocalStorage
        );
      }
    });

    // setTodoDone
    const todoCard = document.querySelector("#todo_card" + index);
    todoCard.addEventListener("dblclick", () => {
      setTodoDone(
        todo,
        filteredTodos,
        allTodos,
        todosContainer,
        saveToLocalStorage
      );

      renderTodosProgress(filteredTodos);
    });
  });
}

// addTodo()
export function addTodo(
  id,
  addTodoNameInput,
  addTodoDescriptionInput,
  state,
  filteredTodos,
  allTodos,
  renderTodos,
  todosContainer,
  saveToLocalStorage
) {
  const todoNameValue = addTodoNameInput.value;
  const todoDescriptionValue = addTodoDescriptionInput.value;

  const newTodo = {
    id: id,
    name: todoNameValue,
    description: todoDescriptionValue,
    isDone: false,
    createdAt: new Date().toISOString(),
    category: state.selectedCategory,
  };

  addTodoNameInput.value = "";
  addTodoDescriptionInput.value = "";

  if (todoNameValue) {
    allTodos.push(newTodo);
    filteredTodos.push(newTodo);
  }

  saveToLocalStorage("todos", allTodos);
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// editTodo()
function editTodo(editTodoNameInput, editTodoDescriptionInput, todo) {
  editTodoNameInput.value = todo.name;
  editTodoDescriptionInput.value = todo.description;
}

// saveEditedTodo()
function saveEditedTodo(
  todo,
  editTodoNameInput,
  editTodoDescriptionInput,
  filteredTodos,
  allTodos,
  renderTodos,
  todosContainer,
  saveToLocalStorage
) {
  const editedTodoNameValue = editTodoNameInput.value;
  const editedTodoDescriptionValue = editTodoDescriptionInput.value;

  const allTodosIndex = allTodos.findIndex((t) => t.id === todo.id);
  const filteredTodosIndex = filteredTodos.findIndex((t) => t.id === todo.id);

  if (allTodosIndex !== -1) {
    allTodos[allTodosIndex].name = editedTodoNameValue;
    allTodos[allTodosIndex].description = editedTodoDescriptionValue;
  }

  if (filteredTodosIndex !== -1) {
    filteredTodos[filteredTodosIndex].name = editedTodoNameValue;
    filteredTodos[filteredTodosIndex].description = editedTodoDescriptionValue;
  }

  saveToLocalStorage("todos", allTodos);
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// deleteTodo()
function deleteTodo(
  todo,
  allTodos,
  filteredTodos,
  renderTodos,
  todosContainer,
  saveToLocalStorage
) {
  const allTodoIndex = allTodos.findIndex((t) => t.id === todo.id);
  const filteredTodoIndex = filteredTodos.findIndex((t) => t.id === todo.id);
  console.log(allTodoIndex, filteredTodoIndex);
  allTodos.splice(allTodoIndex, 1);
  filteredTodos.splice(filteredTodoIndex, 1);

  saveToLocalStorage("todos", allTodos);
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
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

// sortTodo()
export function sortTodos(
  primaryOptionName,
  secondaryOptionName,
  todosContainer,
  selectedCategory,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  if (primaryOptionName && !secondaryOptionName) {
    switch (primaryOptionName) {
      case "name":
        sortByName(
          "asc",
          todosContainer,
          filteredTodos,
          allTodos,
          saveToLocalStorage
        );
        break;

      case "date":
        sortByDate(
          "asc",
          todosContainer,
          filteredTodos,
          allTodos,
          saveToLocalStorage
        );
        break;

      case "done":
        sortByDone(
          "asc",
          todosContainer,
          filteredTodos,
          allTodos,
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
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "date") {
          sortByDate(
            "asc",
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "done") {
          sortByDone(
            "asc",
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        }
        break;

      case "des":
        if (primaryOptionName === "name") {
          sortByName(
            "des",
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "date") {
          sortByDate(
            "des",
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        } else if (primaryOptionName === "done") {
          sortByDone(
            "des",
            todosContainer,
            filteredTodos,
            allTodos,
            saveToLocalStorage
          );
        }
        break;

      case "reset":
        resetTodos(
          todosContainer,
          selectedCategory,
          filteredTodos,
          allTodos,
          saveToLocalStorage
        );
        break;

      default:
        break;
    }
  }
}

// sortByName()
function sortByName(
  type,
  todosContainer,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  if (type == "asc") {
    filteredTodos = filteredTodos.sort((a, b) => a.name.localeCompare(b.name));
  } else if (type == "des") {
    filteredTodos = filteredTodos.sort((a, b) => b.name.localeCompare(a.name));
  }
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// sortByDate()
function sortByDate(
  type,
  todosContainer,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  if (type == "asc") {
    filteredTodos = filteredTodos.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (type == "des") {
    filteredTodos = filteredTodos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// sortByDone()
function sortByDone(
  type,
  todosContainer,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  if (type == "des") {
    filteredTodos = filteredTodos.sort((a, b) => a.isDone - b.isDone);
  } else if (type == "asc") {
    filteredTodos = filteredTodos.sort((a, b) => b.isDone - a.isDone);
  }

  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// resetTodos()
function resetTodos(
  todosContainer,
  selectedCategory,
  filteredTodos,
  allTodos,
  saveToLocalStorage
) {
  filteredTodos = allTodos.filter((todo) => todo.category === selectedCategory);
  // Doing this in order to change the reference of the objects of allTodos
  filteredTodos = filteredTodos.map((todo) => ({ ...todo }));
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// setTodoDone()
function setTodoDone(
  todo,
  filteredTodos,
  allTodos,
  todosContainer,
  saveToLocalStorage
) {
  const allTodosIndex = allTodos.findIndex((t) => t.id === todo.id);
  const filteredTodosIndex = filteredTodos.findIndex((t) => t.id === todo.id);

  if (allTodosIndex !== -1) {
    const isDoneOfAllTodos = !allTodos[allTodosIndex].isDone;
    allTodos[allTodosIndex].isDone = isDoneOfAllTodos;
  }

  if (filteredTodosIndex !== -1) {
    const isDoneOfFilteredTodos = !filteredTodos[filteredTodosIndex].isDone;
    filteredTodos[filteredTodosIndex].isDone = isDoneOfFilteredTodos;
  }

  saveToLocalStorage("todos", allTodos);
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
}

// searchTodos()
export function searchTodos(
  searchInput,
  filteredTodos,
  allTodos,
  todosContainer,
  saveToLocalStorage
) {
  filteredTodos = filteredTodos.filter((todo) =>
    todo.name?.toLowerCase().includes(searchInput?.toLowerCase())
  );
  renderTodos(
    todosContainer,
    filteredTodos,
    allTodos,
    saveToLocalStorage,
    saveToLocalStorage
  );
}

// renderTodosProgress()
export function renderTodosProgress(filteredTodos) {
  const totalTodos = filteredTodos.length;
  const doneTodos = filteredTodos.filter((todo) => todo.isDone === true).length;
  const donePercentage = totalTodos === 0 ? 0 : (doneTodos / totalTodos) * 100;
  document
    .querySelector("#todos_progress")
    .setAttribute("value", donePercentage);

  document.querySelector("#todos_progress_score").innerText =
    doneTodos + " / " + totalTodos;
}
