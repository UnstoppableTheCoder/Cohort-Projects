// All the main top level containers
const signupForm = document.getElementById("signup_form");
const loginForm = document.getElementById("login_form");
const todosContainer = document.getElementById("todos_container");
const logoutBtn = document.getElementById("logout_btn");
const todosList = document.getElementById("todos_list");

// Signup Elements
const signupEmail = document.getElementById("signup_email");
const signupPassword = document.getElementById("signup_password");
const signupConfirmPassword = document.getElementById(
  "signup_confirm_password"
);
const signupBtn = document.getElementById("signup_btn");
const loginPageLink = document.getElementById("login_page_link");

// Login Elements
const loginEmail = document.getElementById("login_email");
const loginPassword = document.getElementById("login_password");
const loginBtn = document.getElementById("login_btn");
const signupPageLink = document.getElementById("signup_page_link");

// Add todo Elements
const todoInputEle = document.getElementById("todo_input_element");
const todoAddBtn = document.getElementById("todo_add_btn");
const todoAddForm = document.getElementById("todo_add_form");

let formToRender = "loginForm";
let eventListenersAttached = false;
const todoOpt = {
  indexNo: -1,
  isEditingTodo: false,
};

// Logout
logoutBtn.addEventListener("click", logoutUser);

// Add todo
todoAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "https://backend-for-todo-app-luna.onrender.com/api/v1/todos",
      {
        task: todoInputEle.value,
      },
      { withCredentials: true }
    );

    todoInputEle.value = "";

    console.log(response.data.data.createdTodo);
    render();
  } catch (error) {
    alert(error.response.data.message);
    console.log(error.response.data.message);
  }
});

// Render
async function render() {
  try {
    // Fetch Todo
    const res = await fetch(
      "https://backend-for-todo-app-luna.onrender.com/api/v1/todos",
      {
        credentials: "include",
      }
    );
    console.log("Fetching");
    console.log(await res.json());

    if (!res.ok) {
      renderPage(formToRender);
      if (!eventListenersAttached) {
        signupPageLink?.addEventListener("click", () => {
          formToRender = "signupForm";
          render();
        });

        loginPageLink?.addEventListener("click", () => {
          formToRender = "loginForm";
          render();
        });

        loginBtn?.addEventListener("click", loginUser);
        signupBtn?.addEventListener("click", signupUser);

        eventListenersAttached = true;
      }
      return;
    }

    renderPage("todosContainer");

    const resData = await res.json();
    const todos = resData.data.todos;

    // Listing todos
    todosList.innerHTML = "";
    todos.forEach((todo, index) => {
      const { indexNo, isEditingTodo } = todoOpt;
      const todoCard = document.createElement("div");
      todoCard.innerHTML = `
        <div class="relative" id="todo_container${index}">
          <input
            type="checkbox"
            class="absolute top-1/2 transform -translate-y-1/2 left-3 size-4 cursor-pointer"
            id="todo_checkbox${index}"
            ${todo.isDone ? "checked" : ""}
          />

          <input
            type="text"
            value="${todo.task}"
            ${isEditingTodo && indexNo === index ? "" : "readonly"}
            class="${
              isEditingTodo && indexNo === index ? "outline-1 bg-white" : ""
            } ${
        todo.isDone ? "line-through !bg-violet-500" : ""
      } outline-none bg-violet-300 text-violet-700 py-2 rounded-lg w-full text-xl placeholder:text-violet-50 pl-10"
            id="todo_input${index}"
          />

          <div
            class="flex gap-3 absolute top-1/2 right-3 transform -translate-y-1/2"
          >
            <button class="cursor-pointer ${
              isEditingTodo && indexNo === index ? "hidden" : ""
            }" ${
        todo.isDone ? "disabled cursor-not-allowed pointer-events-none" : ""
      } id="todo_edit_btn${index}" >Edit</button>
      
            <button class="cursor-pointer ${
              isEditingTodo && indexNo === index ? "" : "hidden"
            }" ${
        todo.isDone ? "disabled cursor-not-allowed pointer-events-none" : ""
      } id="todo_save_btn${index}" >Save</button>

            <button class="cursor-pointer" id="todo_delete_btn${index}" ${
        todo.isDone ? "disabled cursor-not-allowed pointer-events-none" : ""
      }>Delete</button>
          </div>
        </div>
      `;

      todosList.append(todoCard);

      const todoCheckBox = document.getElementById("todo_checkbox" + index);
      const todoInput = document.getElementById("todo_input" + index);
      const todoEditBtn = document.getElementById("todo_edit_btn" + index);
      const todoSaveBtn = document.getElementById("todo_save_btn" + index);
      const todoDeleteBtn = document.getElementById("todo_delete_btn" + index);

      // edit todo
      todoEditBtn.addEventListener("click", () => {
        todoOpt.isEditingTodo = true;
        todoOpt.indexNo = index;
        render();
      });

      // save todo
      todoSaveBtn.addEventListener("click", async () => {
        todoOpt.isEditingTodo = false;
        todoOpt.indexNo = -1;
        try {
          const todoInputName = todoInput.value;
          const response = await axios.put(
            `https://backend-for-todo-app-luna.onrender.com/api/v1/todos/${todo._id}`,
            { task: todoInputName },
            { withCredentials: true }
          );

          console.log(response.data.data.updatedTodo);
          alert(response.data.message);
          render();
        } catch (error) {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        }
      });

      // delete todo
      todoDeleteBtn.addEventListener("click", async () => {
        try {
          const response = await axios.delete(
            `https://backend-for-todo-app-luna.onrender.com/api/v1/todos/${todo._id}`,
            {
              withCredentials: true,
            }
          );

          console.log(response.data.data.deletedTodo);
          alert(response.data.message);
          render();
        } catch (error) {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        }
      });

      // mark todo as done
      todoCheckBox.addEventListener("click", async () => {
        try {
          const response = await axios.put(
            `https://backend-for-todo-app-luna.onrender.com/api/v1/todos/set-done/${todo._id}`,
            {},
            {
              withCredentials: true,
            }
          );

          console.log(response.data.data.deletedTodo);
          render();
        } catch (error) {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        }
      });
    });
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Render page
function renderPage(pageToRender) {
  const all = [signupForm, loginForm, todosContainer];
  all.forEach((el) => el.classList.add("hidden"));
  all.forEach((el) => el.classList.remove("flex"));

  if (pageToRender === "signupForm")
    signupForm.classList.replace("hidden", "flex");
  if (pageToRender === "loginForm")
    loginForm.classList.replace("hidden", "flex");
  if (pageToRender === "todosContainer")
    todosContainer.classList.replace("hidden", "flex");
}

// Login User
async function loginUser(event) {
  event.preventDefault();

  try {
    const email = loginEmail.value;
    const password = loginPassword.value;

    const res = await fetch(
      "https://backend-for-todo-app-luna.onrender.com/api/v1/users/login",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      alert(error.message || "Login failed");
      return;
    }

    loginEmail.value = "";
    loginPassword.value = "";

    console.log("Login successful");
    render();
  } catch (error) {
    console.log("Login error:", error.message);
  }
}

// Signup User
async function signupUser(event) {
  event.preventDefault();

  try {
    const email = signupEmail.value;
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;

    const res = await fetch(
      "https://backend-for-todo-app-luna.onrender.com/api/v1/users/signup",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }
    signupEmail.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";

    console.log("Signup successful");
    render();
  } catch (error) {
    console.log("Signup error:", error.message);
  }
}

// Logout User
async function logoutUser() {
  try {
    const res = await fetch(
      `https://backend-for-todo-app-luna.onrender.com/api/v1/users/logout`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Logout failed");
    }

    render();
  } catch (error) {
    console.log("Logout Error: ", error);
  }
}

render();
