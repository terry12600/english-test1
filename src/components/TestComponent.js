import React, { useState } from 'react';

function TestComponent({ test }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
      setShowResult(true);
    }
  };

  const calculateScore = (answers) => {
    let totalScore = 0;
    answers.forEach((answer, index) => {
      if (answer === test.questions[index].correct) {
        totalScore += test.title === "閱讀測驗" ? 2 : 1;
      }
    });
    setScore(totalScore);
  };

  if (showResult) {
    return (
      <div className="test-result">
        <h2>測驗完成！</h2>
        <p>您的得分：{score} 分</p>
        <button onClick={() => window.location.reload()}>返回首頁</button>
      </div>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <div className="test-container">
      <h2>{test.title}</h2>
      {test.title === "閱讀測驗" && (
        <div className="passage">
          <p>{question.passage}</p>
        </div>
      )}
      <div className="question">
        <h3>問題 {currentQuestion + 1} / {test.questions.length}</h3>
        <p>{question.question}</p>
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestComponent;