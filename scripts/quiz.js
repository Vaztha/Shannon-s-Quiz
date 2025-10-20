let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let usedIndexes = [];

const startBtn = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const scoreText = document.getElementById("score-text");
const timerDisplay = document.getElementById("timer");

function initQuiz(jsonPath) {
  fetch(jsonPath)
    .then((res) => res.json())
    .then((data) => {
      questions = shuffle(data.questions);
      startBtn.addEventListener("click", startQuiz);
      nextBtn.addEventListener("click", handleNext);
    });
}

function startQuiz() {
  startBtn.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  usedIndexes = [];
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = `⏱ ${timeLeft}s`;
  timer = setInterval(updateTimer, 1000);

  // Selecciona 7 preguntas aleatorias
  if (usedIndexes.length >= 7 || usedIndexes.length == questions.length) {
    endQuiz();
    return;
  }

  let index;
  do {
    index = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);
  const q = questions[index];

  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";

  Object.entries(q.options).forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.className = "option-btn";
    btn.onclick = () => selectOption(parseInt(key), q.correct, btn);
    optionsDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");
}

function selectOption(selectedId, correctId, button) {
  clearInterval(timer);
  const allButtons = optionsDiv.querySelectorAll("button");
  allButtons.forEach((b) => (b.disabled = true));

  if (selectedId === correctId || correctId == -1) {
    button.classList.add("correct");
    score += 10;
  } else {
    button.classList.add("incorrect");
    const correctBtn = [...allButtons].find(
      (b) => b.textContent === optionsDiv.children[correctId - 1]?.textContent
    );
    if (correctBtn) correctBtn.classList.add("correct");
  }

  nextBtn.classList.remove("hidden");
}

function handleNext() {
  if (usedIndexes.length >= 7) {
    endQuiz();
  } else {
    showQuestion();
  }
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `⏱ ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    nextBtn.classList.remove("hidden");
    const allButtons = optionsDiv.querySelectorAll("button");
    allButtons.forEach((b) => (b.disabled = true));
  }
}

function endQuiz() {
  clearInterval(timer);
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreText.textContent = `Your final score: ${score} / 70`;
}

// Función utilitaria para mezclar preguntas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
