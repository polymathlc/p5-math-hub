// P5 Math Hub - Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize KaTeX auto-render
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
    
    // State
    let currentMode = 'learn';
    let currentSubtopic = 'all';
    let currentDifficulty = 'all';
    let currentQuestionIndex = 0;
    let practiceQuestions = [];
    let quizQuestions = [];
    let quizScore = 0;
    let quizAnswered = 0;
    
    // DOM Elements
    const contentArea = document.getElementById('content-area');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    // Event Listeners
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            renderContent();
        });
    });
    
    // Main render function
    function renderContent() {
        switch(currentMode) {
            case 'learn':
                renderLearnMode();
                break;
            case 'practice':
                renderPracticeMode();
                break;
            case 'quiz':
                renderQuizMode();
                break;
        }
        renderMath();
    }
    
    // Render math with KaTeX
    function renderMath() {
        setTimeout(() => {
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(contentArea, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        }, 10);
    }
    
    // Learn Mode
    function renderLearnMode() {
        const data = fractionsData.learn;
        let html = `
            <div class="learn-section">
                <h2>${data.title}</h2>
        `;
        
        data.sections.forEach(section => {
            html += `
                <h3>${section.title}</h3>
                ${section.content}
            `;
        });
        
        html += `
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="startPractice()">Start Practice ✏️</button>
            </div>
        </div>`;
        
        contentArea.innerHTML = html;
    }
    
    // Practice Mode
    function renderPracticeMode() {
        // Filter questions
        let questions = fractionsData.questions.filter(q => {
            if (currentSubtopic !== 'all' && q.subtopic !== currentSubtopic) return false;
            if (currentDifficulty !== 'all' && q.difficulty !== currentDifficulty) return false;
            return true;
        });
        
        if (practiceQuestions.length === 0 || currentQuestionIndex >= practiceQuestions.length) {
            // Shuffle and start new practice
            practiceQuestions = shuffleArray([...questions]);
            currentQuestionIndex = 0;
        }
        
        renderPracticeQuestion();
    }
    
    function renderPracticeQuestion() {
        if (practiceQuestions.length === 0) {
            contentArea.innerHTML = `
                <div class="practice-section">
                    <p>No questions match your filters. Try different settings.</p>
                </div>
            `;
            return;
        }
        
        const q = practiceQuestions[currentQuestionIndex];
        
        let html = `
            <div class="practice-section">
                <div class="subtopic-selector">
                    <button class="subtopic-pill ${currentSubtopic === 'all' ? 'active' : ''}" 
                            onclick="setSubtopic('all')">All Topics</button>
                    ${fractionsData.subtopics.map(st => `
                        <button class="subtopic-pill ${currentSubtopic === st ? 'active' : ''}"
                                onclick="setSubtopic('${st}')">${st}</button>
                    `).join('')}
                </div>
                
                <div class="difficulty-selector">
                    <button class="diff-pill ${currentDifficulty === 'all' ? 'active' : ''}" 
                            onclick="setDifficulty('all')">All</button>
                    <button class="diff-pill easy ${currentDifficulty === 'easy' ? 'active' : ''}"
                            onclick="setDifficulty('easy')">Easy</button>
                    <button class="diff-pill medium ${currentDifficulty === 'medium' ? 'active' : ''}"
                            onclick="setDifficulty('medium')">Medium</button>
                    <button class="diff-pill hard ${currentDifficulty === 'hard' ? 'active' : ''}"
                            onclick="setDifficulty('hard')">Hard</button>
                </div>
                
                <div class="question-card">
                    <span class="question-number">${currentQuestionIndex + 1}</span>
                    <div class="question-text">${q.question}</div>
                    
                    <div class="options-grid" id="options-grid">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn" onclick="selectPracticeAnswer(${i}, ${q.correctIndex})">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div id="explanation-area"></div>
                </div>
                
                <div id="practice-nav" style="display: none; text-align: center; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="nextPracticeQuestion()">Next Question →</button>
                </div>
            </div>
        `;
        
        contentArea.innerHTML = html;
        renderMath();
    }
    
    // Quiz Mode
    function renderQuizMode() {
        let html = `
            <div class="practice-section">
                <h2 style="text-align: center; margin-bottom: 20px;">🎯 Fractions Quiz</h2>
                
                <div class="difficulty-selector">
                    <button class="diff-pill ${currentDifficulty === 'all' ? 'active' : ''}" 
                            onclick="setDifficulty('all')">Mixed</button>
                    <button class="diff-pill easy ${currentDifficulty === 'easy' ? 'active' : ''}"
                            onclick="setDifficulty('easy')">Easy</button>
                    <button class="diff-pill medium ${currentDifficulty === 'medium' ? 'active' : ''}"
                            onclick="setDifficulty('medium')">Medium</button>
                    <button class="diff-pill hard ${currentDifficulty === 'hard' ? 'active' : ''}"
                            onclick="setDifficulty('hard')">Hard</button>
                </div>
                
                <p style="text-align: center; color: var(--text-light); margin-bottom: 30px;">
                    10 questions • Test your fraction skills!
                </p>
                
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="startQuiz()">Start Quiz 🚀</button>
                </div>
            </div>
        `;
        
        contentArea.innerHTML = html;
    }
    
    function startQuiz() {
        let questions = fractionsData.questions.filter(q => {
            if (currentDifficulty !== 'all' && q.difficulty !== currentDifficulty) return false;
            return true;
        });
        
        quizQuestions = shuffleArray([...questions]).slice(0, 10);
        currentQuestionIndex = 0;
        quizScore = 0;
        quizAnswered = 0;
        
        renderQuizQuestion();
    }
    
    function renderQuizQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            renderQuizResults();
            return;
        }
        
        const q = quizQuestions[currentQuestionIndex];
        const progress = ((currentQuestionIndex) / quizQuestions.length * 100).toFixed(0);
        
        let html = `
            <div class="quiz-section">
                <div class="quiz-header">
                    <div class="quiz-progress">
                        Question ${currentQuestionIndex + 1} of ${quizQuestions.length}
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div class="quiz-score">Score: ${quizScore}/${quizAnswered}</div>
                </div>
                
                <div class="question-card">
                    <span class="question-number">${currentQuestionIndex + 1}</span>
                    <div class="question-text">${q.question}</div>
                    
                    <div class="options-grid" id="options-grid">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn" onclick="selectQuizAnswer(${i}, ${q.correctIndex})">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div id="explanation-area"></div>
                </div>
                
                <div id="quiz-nav" style="display: none; text-align: center; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="nextQuizQuestion()">
                        ${currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
                    </button>
                </div>
            </div>
        `;
        
        contentArea.innerHTML = html;
        renderMath();
    }
    
    function renderQuizResults() {
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            message = 'Outstanding! You\'ve mastered fractions!';
            emoji = '🌟';
        } else if (percentage >= 70) {
            message = 'Great job! Keep practicing!';
            emoji = '👏';
        } else if (percentage >= 50) {
            message = 'Good effort! Review the concepts and try again.';
            emoji = '💪';
        } else {
            message = 'Keep learning! Practice makes perfect.';
            emoji = '📚';
        }
        
        let html = `
            <div class="results-section">
                <div style="font-size: 4rem; margin-bottom: 20px;">${emoji}</div>
                <div class="results-score">${percentage}%</div>
                <div class="results-message">${message}</div>
                
                <div class="results-breakdown">
                    <div class="result-item correct">
                        <div class="number">${quizScore}</div>
                        <div class="label">Correct</div>
                    </div>
                    <div class="result-item incorrect">
                        <div class="number">${quizQuestions.length - quizScore}</div>
                        <div class="label">Incorrect</div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="startQuiz()">Try Again 🔄</button>
                <button class="btn btn-secondary" onclick="goToLearn()">Review Concepts 📚</button>
            </div>
        `;
        
        contentArea.innerHTML = html;
    }
    
    // Helper Functions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Global functions (called from onclick)
    window.startPractice = function() {
        modeButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-mode="practice"]').classList.add('active');
        currentMode = 'practice';
        practiceQuestions = [];
        currentQuestionIndex = 0;
        renderContent();
    };
    
    window.setSubtopic = function(subtopic) {
        currentSubtopic = subtopic;
        practiceQuestions = [];
        currentQuestionIndex = 0;
        renderPracticeMode();
    };
    
    window.setDifficulty = function(difficulty) {
        currentDifficulty = difficulty;
        practiceQuestions = [];
        currentQuestionIndex = 0;
        if (currentMode === 'practice') {
            renderPracticeMode();
        } else {
            renderQuizMode();
        }
    };
    
    window.selectPracticeAnswer = function(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === correct) {
                btn.classList.add('correct');
            } else if (i === selected && selected !== correct) {
                btn.classList.add('incorrect');
            }
        });
        
        const q = practiceQuestions[currentQuestionIndex];
        const isCorrect = selected === correct;
        
        document.getElementById('explanation-area').innerHTML = `
            <div class="explanation ${isCorrect ? '' : 'wrong'}">
                <h4>${isCorrect ? '✓ Correct!' : '✗ Not quite right'}</h4>
                <p>${q.explanation}</p>
            </div>
        `;
        
        document.getElementById('practice-nav').style.display = 'block';
        renderMath();
    };
    
    window.nextPracticeQuestion = function() {
        currentQuestionIndex++;
        if (currentQuestionIndex >= practiceQuestions.length) {
            practiceQuestions = shuffleArray([...fractionsData.questions.filter(q => {
                if (currentSubtopic !== 'all' && q.subtopic !== currentSubtopic) return false;
                if (currentDifficulty !== 'all' && q.difficulty !== currentDifficulty) return false;
                return true;
            })]);
            currentQuestionIndex = 0;
        }
        renderPracticeQuestion();
    };
    
    window.selectQuizAnswer = function(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === correct) {
                btn.classList.add('correct');
            } else if (i === selected && selected !== correct) {
                btn.classList.add('incorrect');
            }
        });
        
        const q = quizQuestions[currentQuestionIndex];
        const isCorrect = selected === correct;
        
        if (isCorrect) quizScore++;
        quizAnswered++;
        
        document.getElementById('explanation-area').innerHTML = `
            <div class="explanation ${isCorrect ? '' : 'wrong'}">
                <h4>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
                <p>${q.explanation}</p>
            </div>
        `;
        
        document.getElementById('quiz-nav').style.display = 'block';
        
        // Update score display
        document.querySelector('.quiz-score').textContent = `Score: ${quizScore}/${quizAnswered}`;
        
        renderMath();
    };
    
    window.nextQuizQuestion = function() {
        currentQuestionIndex++;
        renderQuizQuestion();
    };
    
    window.startQuiz = startQuiz;
    
    window.goToLearn = function() {
        modeButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-mode="learn"]').classList.add('active');
        currentMode = 'learn';
        renderContent();
    };
    
    // Initial render
    renderContent();
});
