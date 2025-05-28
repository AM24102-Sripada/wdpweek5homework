let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result"); // This element is not strictly needed for your current showResult implementation, but good to keep if you plan to use it later.

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        // Call showQuestion() only if there are questions loaded
        if (questions.length > 0) {
            showQuestion();
        } else {
            // Handle case where no questions are loaded
            questionText.textContent = "No questions found. Please check questions.json";
            nextBtn.disabled = true;
        }
    })
    .catch(error => {
        console.error("Error fetching questions:", error);
        questionText.textContent = "Failed to load questions. Please check the console for more details.";
        nextBtn.disabled = true;
    });

function showQuestion() {
    clearOptions();
    document.getElementById("question-count").textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.question;

    q.options.forEach((option, index) => {
        const optionButton = document.createElement("button");
        optionButton.textContent = option;
        optionButton.classList.add("option");
        // Add a class for styling for all buttons
        optionButton.classList.add("option-button"); 
        optionButton.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(optionButton);
    });
}

function checkAnswer(selectedIndex) {
    const correct = questions[currentQuestionIndex].answer;
    if (selectedIndex === correct) {
        score++;
    }
    nextBtn.disabled = false;
    Array.from(optionsContainer.children).forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) {
            btn.style.backgroundColor = "#a4edba"; // Correct answer
        }
        if (i === selectedIndex && i !== correct) {
            btn.style.backgroundColor = "#f5a3a3"; // Incorrectly selected answer
        }
    });
}

function clearOptions() {
    optionsContainer.innerHTML = "";
    nextBtn.disabled = true;
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.querySelector(".quiz-box").innerHTML = `<h2>Your score: ${score} / ${questions.length}</h2>`;
}