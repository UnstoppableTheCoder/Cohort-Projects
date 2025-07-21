import {
  addCategory,
  normalizeColorOfPrevSortOpt,
  renderCategories,
  searchCategories,
  setColorToSortOpt,
  sortCategories,
} from "../utils/category.js";
import { categories, state, todos, icons } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { saveToLocalStorage } from "../utils/helper.js";

const allCategories = [...categories];

// Categories
const categoriesContainer = document.querySelector("#categories_container");

renderCategories(
  categoriesContainer,
  allCategories,
  todos,
  state,
  saveToLocalStorage
);

// Create Category
const createCategoryBtn = document.querySelector("#create_category_btn");
const createCategoryDialog = document.querySelector("#create_category_dialog");
const createCategoryInput = document.querySelector("#create_category_input");
const addCategoryBtn = document.querySelector("#add_category_btn");
const categoryModalCancelBtn = document.querySelector(
  "#category_modal_cancel_btn"
);

createCategoryBtn.addEventListener("click", () => {
  createCategoryDialog.showModal();
});

// addCategoryBtn
addCategoryBtn.addEventListener("click", function () {
  addCategory(
    uuidv4(),
    createCategoryInput,
    categoryModalCancelBtn,
    categoriesContainer,
    icons,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
});

// add created category when clicked Enter
createCategoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    categoryModalCancelBtn.click();
    addCategory(
      uuidv4(),
      createCategoryInput,
      categoryModalCancelBtn,
      categoriesContainer,
      icons,
      allCategories,
      todos,
      state,
      saveToLocalStorage
    );
  }
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

  sortCategories(
    primaryOptionName,
    secondaryOptionName,
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );

  // Giving a color to primaryOptionName and secondaryOptionName
  setColorToSortOpt(primaryOptionName, secondaryOptionName);
});

// ------------------------------ All Categories ---------------------------------
document.querySelector("#all_categories").addEventListener("click", () => {
  renderCategories(
    categoriesContainer,
    allCategories,
    todos,
    state,
    saveToLocalStorage
  );
});

// --------------------------- Search Todos ------------------------------
const categorySearchInput = document.querySelector("#category_search_input");
const categorySearchBtn = document.querySelector("#category_search_btn");

let searchInput = "";
categorySearchInput.addEventListener("input", function () {
  searchInput = this.value;
});

// ---------------------- Search Categories when clicked Enter --------------------
categorySearchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCategories(
      searchInput,
      allCategories,
      categoriesContainer,
      todos,
      state,
      saveToLocalStorage
    );
    categorySearchInput.value = "";
  }
});

categorySearchBtn.addEventListener("click", () => {
  searchCategories(
    searchInput,
    allCategories,
    categoriesContainer,
    todos,
    state,
    saveToLocalStorage
  );
  categorySearchInput.value = "";
});