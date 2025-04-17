import { useState } from 'react';
import { vocabularyList } from '../data/vocabulary';
import ScoreRecord from './ScoreRecord';

function FlashCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    
    if (currentIndex < 9) {  // 假設每次測驗10題
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setTestCompleted(true);
    }
  };

  return (
    <div className="flashcard-container">
      {!testCompleted ? (
        <div className="flashcard">
          <h3>題目 {currentIndex + 1}/10</h3>
          <p>{vocabularyList[currentIndex].english}</p>
          {showAnswer ? (
            <>
              <p>{vocabularyList[currentIndex].chinese}</p>
              <button onClick={() => handleAnswer(true)}>答對了</button>
              <button onClick={() => handleAnswer(false)}>答錯了</button>
            </>
          ) : (
            <button onClick={() => setShowAnswer(true)}>顯示答案</button>
          )}
        </div>
      ) : (
        <div className="test-result">
          <h2>測驗完成！</h2>
          <p>得分：{score}/10</p>
          <ScoreRecord score={score} />
          <button onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setTestCompleted(false);
          }}>重新測驗</button>
        </div>
      )}
    </div>
  );
}

export default FlashCard;