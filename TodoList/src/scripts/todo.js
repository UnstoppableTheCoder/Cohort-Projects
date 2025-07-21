import { state, todos, categories } from "./data.js";
import {
  renderTodos,
  addTodo,
  getFilteredTodos,
  normalizeColorOfPrevSortOpt,
  setColorToSortOpt,
  sortTodos,
  searchTodos,
  renderTodosProgress,
} from "../utils/todo.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { saveToLocalStorage } from "../utils/helper.js";

// Data
let allTodos = todos.map((todo) => ({ ...todo }));
const selectedCategory = state.selectedCategory;

let filteredTodos = getFilteredTodos([...allTodos], selectedCategory);

let category = categories.find((category) => category.id === selectedCategory);

const categoryName = document.querySelector("#category_name");
categoryName.innerText = `Category: ${category?.name || ""}`;

const todosContainer = document.querySelector("#todos-container");

// --------------------------- Render Todos -----------------------------
renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);

// ---------------------------- Render TodosProgress ----------------------
renderTodosProgress(filteredTodos);

// ---------------------------Create Todos -----------------------------
const createTodoBtn = document.querySelector("#create_todo_btn");
const createTodoDialog = document.querySelector("#create_todo_dialog");
const addTodoNameInput = document.querySelector("#add_todo_input");
const addTodoDescriptionInput = document.querySelector(
  "#add_description_input"
);
const addBtn = document.querySelector("#add_btn");
const addModalCancelBtn = document.querySelector("#add_modal_cancel_btn");

createTodoBtn.addEventListener("click", () => {
  createTodoDialog.showModal();
});

addBtn.addEventListener("click", () => {
  addModalCancelBtn.click();
  addTodo(
    uuidv4(),
    addTodoNameInput,
    addTodoDescriptionInput,
    state,
    filteredTodos,
    allTodos,
    renderTodos,
    todosContainer,
    saveToLocalStorage
  );
});

// addTodoNameInput -> when clicked Enter
addTodoNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addModalCancelBtn.click();
    addTodo(
      uuidv4(),
      addTodoNameInput,
      addTodoDescriptionInput,
      state,
      filteredTodos,
      allTodos,
      renderTodos,
      todosContainer,
      saveToLocalStorage
    );
  }
});

// addTodoDescriptionInput -> When clicked Enter
addTodoDescriptionInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo(
      uuidv4(),
      addTodoNameInput,
      addTodoDescriptionInput,
      state,
      filteredTodos,
      allTodos,
      renderTodos,
      todosContainer,
      saveToLocalStorage
    );
    addModalCancelBtn.click();
  }
});

// --------------------------- Search Todos ------------------------------
const todoSearchInput = document.querySelector("#todo_search_input");
const todoSearchBtn = document.querySelector("#todo_search_btn");

let searchInput = "";
todoSearchInput.addEventListener("input", function () {
  searchInput = this.value;
});

// ---------------------- Search todo when clicked Enter --------------------
todoSearchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchTodos(
      searchInput,
      filteredTodos,
      allTodos,
      todosContainer,
      saveToLocalStorage
    );
    todoSearchInput.value = "";
  }
});

todoSearchBtn.addEventListener("click", () => {
  searchTodos(
    searchInput,
    filteredTodos,
    allTodos,
    todosContainer,
    saveToLocalStorage
  );
  todoSearchInput.value = "";
});

// ---------------------------Sort Todos ---------------------------------
let primaryOptionName = "";
let secondaryOptionName = "";

export function setSecondaryOptionName(name) {
  secondaryOptionName = name;
}

const sortingOptions = document.querySelector("#sorting_options");
sortingOptions.addEventListener("click", (event) => {
  let selectedOption = event.target.dataset.id;

  // normalizeColorOfPrevSortOpt
  normalizeColorOfPrevSortOpt(primaryOptionName, secondaryOptionName);

  if (
    selectedOption === "name" ||
    selectedOption === "date" ||
    selectedOption === "done"
  ) {
    primaryOptionName = selectedOption;
  } else {
    if (primaryOptionName) {
      secondaryOptionName = selectedOption;
    }
  }

  sortTodos(
    primaryOptionName,
    secondaryOptionName,
    todosContainer,
    selectedCategory,
    filteredTodos,
    allTodos,
    saveToLocalStorage
  );

  // Giving a color to primaryOptionName and secondaryOptionName
  setColorToSortOpt(primaryOptionName, secondaryOptionName);
});

// ------------------------------ All todos ---------------------------------
document.querySelector("#all_todos").addEventListener("click", () => {
  renderTodos(todosContainer, filteredTodos, allTodos, saveToLocalStorage);
});
