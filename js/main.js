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
      while(ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      this.answers.forEach(answer => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.addEventListener('click', ()=> {
          nextQuiz(answer);
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
    }

    getCategory() {
      return this.category;
    }

    getCorrectAnswer() {
      return this.correctAnswer;
    }

    getDifficulty() {
      return this.difficulty;
    }

    getQuestion() {
      return this.question;
    }
  }

  const h1 = document.querySelector('h1');
  const info = document.getElementById('info');
  const category = document.getElementById('category');
  const difficulty = document.getElementById('difficulty');
  const message = document.getElementById('message');
  const ul = document.querySelector('ul');
  const btn = document.getElementById('btn');
  let quizzes = [];
  let correct = 0;
  let currentQuiz = 0;
  let playing = false;

  function nextQuiz(answer) {
    if (answer === quizzes[currentQuiz].getCorrectAnswer()) {
      correct++;
    }
    
    currentQuiz++;

    if ((quizzes.length -1) < currentQuiz) {
      while(ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      h1.textContent = `あなたの正答数は${correct}です！！`;
      info.classList.add('hide');
      category.textContent = '';
      difficulty.textContent = '';
      message.textContent = "再度チャレンジしたい場合は以下をクリック！！";
      btn.textContent = 'ホームに戻る';
      btn.classList.remove('hide');
      quizzes = [];
      correct = 0;
      currentQuiz = 0;
      return;
    }

    h1.textContent = `問題${currentQuiz + 1}`;
    category.textContent = `[ジャンル]${quizzes[currentQuiz].getCategory()}`;
    difficulty.textContent = `[難易度]${quizzes[currentQuiz].getDifficulty()}`;
    message.innerHTML = quizzes[currentQuiz].getQuestion();
    quizzes[currentQuiz].displayQuiz()
  }

  document.getElementById('btn').addEventListener('click', () => {
    if (playing === false) {
      playing = true;
      h1.textContent = "取得中";
      message.textContent = "少々お待ちください";
  
      fetch('https://opentdb.com/api.php?amount=10')
      .then(function(response){
        return response.json()
      })
      .then(function(json){
        const results = Array.from(json.results);
        results.forEach(quiz => {
          quizzes.push(new Quiz(quiz));
        });
      })
      .then(function(){
        h1.textContent = `問題${currentQuiz + 1}`;
        info.classList.remove('hide');
        category.textContent = `[ジャンル]${quizzes[currentQuiz].getCategory()}`;
        difficulty.textContent = `[難易度]${quizzes[currentQuiz].getDifficulty()}`;
        message.innerHTML = quizzes[currentQuiz].getQuestion();
        btn.classList.add('hide');
        quizzes[currentQuiz].displayQuiz()
      });
    } else {
      h1.textContent = "ようこそ";
      message.textContent = "以下のボタンをクリック";
      btn.textContent = "開始";
      playing = false;
    }
  });
}