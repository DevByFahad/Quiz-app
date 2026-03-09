// Quiz Questions
const quizData = [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Multi Language"], answer: 0 },
    { question: "Which language is used for styling web pages?", options: ["HTML", "JQuery", "CSS", "XML"], answer: 2 },
    { question: "Which is not a JavaScript framework?", options: ["Python Script", "JQuery", "Django", "NodeJS"], answer: 2 },
    { question: "Which symbol is used for comments in JavaScript?", options: ["//", "<!-- -->", "#", "/* */"], answer: 0 },
    { question: "Which HTML attribute is used to define inline styles?", options: ["style", "class", "font", "styles"], answer: 0 }
];

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentEl = document.getElementById("current");
const totalEl = document.getElementById("total");
const progressEl = document.getElementById("progress");

const resultScreen = document.getElementById("resultScreen");
const scoreEl = document.getElementById("score");
const percentageEl = document.getElementById("percentage");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

const quizContainer = document.getElementById("quizContainer");

// Confetti Setup
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confettiParticles = [];

// Keyboard Support
let keyboardIndex = 0;

let currentQuestion = 0;
let selectedOptions = [];
let score = 0;

totalEl.textContent = quizData.length;

// Load Question
function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;

    optionsEl.innerHTML = "";
    q.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.textContent = option;

        if (selectedOptions[currentQuestion] === index) li.classList.add("selected");

        li.addEventListener("click", () => selectOption(index, li));
        optionsEl.appendChild(li);
    });

    currentEl.textContent = currentQuestion + 1;
    progressEl.style.width = `${((currentQuestion) / quizData.length) * 100}%`;

    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";

    keyboardIndex = 0; // reset keyboard selection
    highlightKeyboardOption();
}

// Select Option with Live Feedback
function selectOption(index, element) {
    selectedOptions[currentQuestion] = index;

    // Highlight selected
    [...optionsEl.children].forEach(li => li.classList.remove("selected", "correct", "wrong"));
    element.classList.add("selected");

    // Show live feedback
    const correctAnswer = quizData[currentQuestion].answer;
    if (index === correctAnswer) element.classList.add("correct");
    else element.classList.add("wrong");
}

// Next Question
nextBtn.addEventListener("click", () => {
    if (selectedOptions[currentQuestion] === undefined) {
        alert("Please select an option before proceeding!");
        return;
    }

    currentQuestion++;
    if (currentQuestion >= quizData.length) {
        showResult();
    } else {
        loadQuestion();
    }
});

// Previous Question
prevBtn.addEventListener("click", () => {
    currentQuestion--;
    loadQuestion();
});

// Show Result
function showResult() {
    score = 0;
    quizData.forEach((q, index) => {
        if (selectedOptions[index] === q.answer) score++;
    });

    quizContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    scoreEl.textContent = score;
    percentageEl.textContent = ((score / quizData.length) * 100).toFixed(0);

    if (score === quizData.length) {
        resultMessage.textContent = "Excellent!";
        launchConfetti();
    } else if (score >= quizData.length / 2) resultMessage.textContent = "Good Job!";
    else resultMessage.textContent = "Keep Practicing!";
}

// Restart Quiz
restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    selectedOptions = [];
    score = 0;
    resultScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    loadQuestion();
});

// Keyboard Navigation
document.addEventListener("keydown", e => {
    const optionsList = [...optionsEl.children];
    if (optionsList.length === 0) return;

    if (e.key === "ArrowDown") {
        keyboardIndex = (keyboardIndex + 1) % optionsList.length;
        highlightKeyboardOption();
    } else if (e.key === "ArrowUp") {
        keyboardIndex = (keyboardIndex - 1 + optionsList.length) % optionsList.length;
        highlightKeyboardOption();
    } else if (e.key === "Enter") {
        selectOption(keyboardIndex, optionsList[keyboardIndex]);
    }
});

function highlightKeyboardOption() {
    [...optionsEl.children].forEach(li => li.classList.remove("keyboard-selected"));
    if (optionsEl.children[keyboardIndex])
        optionsEl.children[keyboardIndex].classList.add("keyboard-selected");
}

// Confetti Animation
function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 20 + 10,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p, i) => {
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > canvas.height) confettiParticles.splice(i, 1);
    });
    if (confettiParticles.length > 0) requestAnimationFrame(drawConfetti);
}

// Initial load
loadQuestion();