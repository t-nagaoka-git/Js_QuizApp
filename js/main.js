'use strict';

{
  class Quiz {
    constructor(quiz) {
      this.category = quiz.category;
      this.correctAnswer = quiz.correct_answer;
      this.difficulty = quiz.difficulty;
      this.incorrectAnswers = quiz.incorrect_answers;
      this.question = quiz.question;
      this.answers = this.createAnswers();
    }

    createAnswers() {
      const answers = [];
      answers.push(this.correctAnswer);
      answers.push(...this.incorrectAnswers);
      for(let i = answers.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[j], answers[i]] = [answers[i], answers[j]];
      }
      return answers;
    }

    displayQuiz() {
      h1.textContent = `問題${currentQuiz + 1}`;
      category.textContent = `[ジャンル]${this.category}`;
      difficulty.textContent = `[難易度]${this.difficulty}`;
      message.innerHTML = this.question;

      while(ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      this.answers.forEach(answer => {
        const li = document.createElement('li');
        const answerBtn = document.createElement('button');
        answerBtn.innerHTML = answer;
        answerBtn.addEventListener('click', ()=> {
          nextQuiz(answer);
        });
        li.appendChild(answerBtn);
        ul.appendChild(li);
      });
    }

    getCorrectAnswer() {
      return this.correctAnswer;
    }
  }

  const h1 = document.querySelector('h1');
  const info = document.getElementById('info');
  const category = document.getElementById('category');
  const difficulty = document.getElementById('difficulty');
  const message = document.getElementById('message');
  const ul = document.querySelector('ul');
  const startBtn = document.getElementById('startBtn');
  const homeBtn = document.getElementById('homeBtn');
  let quizzes = [];
  let correct = 0;
  let currentQuiz = 0;

  startBtn.addEventListener('click', () => {
    h1.textContent = "取得中";
    message.textContent = "少々お待ちください";
    getQuizFromApi();
  });

  homeBtn.addEventListener('click', () => {
    h1.textContent = "ようこそ";
    message.textContent = "以下のボタンをクリック";
    startBtn.classList.remove('hide');
    homeBtn.classList.add('hide');
  });

  function nextQuiz(answer) {
    if (answer === quizzes[currentQuiz].getCorrectAnswer()) {
      correct++;
    }
    
    currentQuiz++;

    if ((quizzes.length -1) < currentQuiz) {
      displayResult();
      return;
    }

    quizzes[currentQuiz].displayQuiz()
  }
  
  function displayResult() {
    while(ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    h1.textContent = `あなたの正答数は${correct}です！！`;
    info.classList.add('hide');
    category.textContent = '';
    difficulty.textContent = '';
    message.textContent = "再度チャレンジしたい場合は以下をクリック！！";
    homeBtn.classList.remove('hide');
    quizzes = [];
    correct = 0;
    currentQuiz = 0;
  }
  
  function getQuizFromApi() {
    fetch('https://opentdb.com/api.php?amount=10')
    .then(function(response){
      return response.json()
    })
    .then(function(json){
      const results = json.results;
      results.forEach(result => {
        const quiz = result;
        quizzes.push(new Quiz(quiz));
      });
    })
    .then(function(){
      info.classList.remove('hide');
      startBtn.classList.add('hide');
      quizzes[currentQuiz].displayQuiz()
    })
    .catch(() => {
      h1.textContent = "取得エラー";
      message.textContent = "クイズの取得に失敗しました";
    });
  }
}