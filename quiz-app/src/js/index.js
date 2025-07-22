import { quizData } from "./data.js";

const container = document.querySelector("#container");
let quiz = {
  showResult: false,
  start: 0,
  totalQuizzes: quizData.length,
  rightAnswers: 0,
};

renderQuiz();

function renderQuiz() {
  container.innerHTML = `
    <h1 class="mb-5 font-bold text-3xl sm:text-4xl">My Quiz App</h1>
  `;

  const currentQuiz = quizData[quiz.start];

  const divElement = document.createElement("div");

  if (quiz.showResult === false) {
    divElement.innerHTML = `
    <section class="bg-gray-500 p-5 rounded-lg min-w-[300px] sm:w-[400px] space-y-5">
        <div class="space-y-5">
          <div class="text-xl sm:text-2xl font-bold text-gray-100">${currentQuiz?.question}</div>
          <form class="flex flex-col gap-3" id="quiz_answers">
            <div
              class="flex bg-gray-600 rounded-lg items-center w-full relative"
            >
              <input
                type="radio"
                class="cursor-pointer absolute left-2"
                name="quiz-options"
                id="option_1"
                data-id="a"
              />
              <label for="option_1" class="py-3 pl-8 flex-1 cursor-pointer"
                >${currentQuiz["a"]}</label
              >
            </div>

            <div
              class="flex gap-2 bg-gray-600 rounded-lg items-center px-2 w-full cursor-pointer"
            >
              <input
                type="radio"
                class="cursor-pointer"
                name="quiz-options"
                id="option_2"
                data-id="b"
              />
              <label for="option_2" class="py-3 flex-1 cursor-pointer"
                >${currentQuiz["b"]}</label
              >
            </div>

            <div
              class="flex gap-2 bg-gray-600 rounded-lg items-center px-2 w-full cursor-pointer"
            >
              <input
                type="radio"
                class="cursor-pointer"
                name="quiz-options"
                id="option_3"
                data-id="c"
              />
              <label for="option_3" class="py-3 flex-1 cursor-pointer"
                >${currentQuiz["c"]}</label
              >
            </div>

            <div
              class="flex gap-2 bg-gray-600 rounded-lg items-center px-2 w-full cursor-pointer"
            >
              <input
                type="radio"
                class="cursor-pointer"
                name="quiz-options"
                id="option_4"
                data-id="d"
              />
              <label for="option_4" class="py-3 flex-1 cursor-pointer"
                >${currentQuiz["d"]}</label
              >
            </div>

            <button
              type="submit"
              class="w-full py-2 rounded-lg text-xl bg-blue-700 active:bg-blue-800 cursor-pointer"
              id="submit_btn"
            >
              Submit
            </button>
          </form>
        </div>
    </section>
    `;
  } else {
    divElement.innerHTML = `
    <section   section class="bg-gray-500 p-5 rounded-lg w-[400px] space-y-5">
        <div class="space-y-5">
          <h2 class="text-center font-bold text-3xl" id="score">Your score is: 5 / 5</h2>
          <button
            class="w-full py-2 rounded-lg text-xl bg-blue-700 active:bg-blue-800 cursor-pointer"
            id="reload_btn"
          >
            Reload
          </button>
        </div>
    </section>
    `;
  }

  container.append(divElement);

  if (quiz.showResult === false) {
    const quizAnswers = document.querySelector("#quiz_answers");
    quizAnswers.addEventListener("click", (event) => {
      if (event.target.tagName === "INPUT") {
        const answer = event.target.dataset.id;
        if (answer === quizData[quiz.start].correct) {
          quiz.rightAnswers++;
        }

        quiz.start++;

        if (quiz.start === quiz.totalQuizzes) {
          quiz.showResult = true;
        }

        renderQuiz();
      }
    });

    const submitBtn = document.querySelector("#submit_btn");
    submitBtn.addEventListener("click", (event) => {
      event.preventDefault();
      quiz.showResult = true;
      renderQuiz();
    });
  } else {
    const score = document.querySelector("#score");
    score.innerText = `Your score is: ${quiz.rightAnswers} / ${quiz.totalQuizzes}`;

    const reloadBtn = document.querySelector("#reload_btn");
    reloadBtn.addEventListener("click", () => {
      quiz.showResult = false;
      quiz.start = 0;
      quiz.totalQuizzes = quizData.length;
      quiz.rightAnswers = 0;
      renderQuiz();
    });
  }
}
