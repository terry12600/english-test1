import { useState, useEffect } from 'react';
import './Quiz.css';  // 添加这行
import { vocabularyList } from '../data/vocabulary.js';

function Quiz({ onScoreSubmit }) {
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questions, setQuestions] = useState({
    englishToChinese: [],
    chineseToEnglish: [],
    reading: []
  });
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const sections = [
    { title: '测验一：看英拼中', questionCount: 30, pointsPerQuestion: 1 },
    { title: '测验二：看中拼英', questionCount: 30, pointsPerQuestion: 1 },
    { title: '测验三：阅读测验', questionCount: 6, pointsPerQuestion: 2 }
  ];

  const readingQuestions = [
    {
      passage: `Mary: Hi Tom, what's your favorite animal?
Tom: I like dogs very much. They are friendly and smart.
Mary: Do you have a dog at home?
Tom: Yes, I do. His name is Lucky.
Mary: That's a nice name! What color is Lucky?
Tom: He is brown and white.`,
      questions: [
        {
          questionText: "What animal does Tom like?",
          options: ["Cats", "Dogs", "Birds", "Fish"],
          correctAnswer: 1
        },
        {
          questionText: "What is Tom's dog's name?",
          options: ["Happy", "Lucky", "Sunny", "Spot"],
          correctAnswer: 1
        },
        {
          questionText: "What color is Tom's dog?",
          options: ["Black and white", "Brown and black", "Brown and white", "White"],
          correctAnswer: 2
        }
      ]
    },
    {
      passage: `It is Sunday morning. Jenny is in the park with her family.
She sees many children playing there.
Some boys are playing baseball.
Some girls are jumping rope.
Jenny wants to play on the swing.
Her father pushes her high up in the air.
She is very happy.`,
      questions: [
        {
          questionText: "What day is it?",
          options: ["Monday", "Friday", "Saturday", "Sunday"],
          correctAnswer: 3
        },
        {
          questionText: "Where is Jenny?",
          options: ["At home", "In the park", "At school", "In the garden"],
          correctAnswer: 1
        },
        {
          questionText: "What does Jenny want to play?",
          options: ["Baseball", "Jump rope", "Swing", "Basketball"],
          correctAnswer: 2
        }
      ]
    }
  ];

  useEffect(() => {
    generateAllQuestions();
  }, []);

  const generateAllQuestions = () => {
    const shuffledVocabulary = [...vocabularyList].sort(() => Math.random() - 0.5);
    
    // 生成看英拼中題目
    const englishToChineseQuestions = shuffledVocabulary.slice(0, 30).map(word => {
      const options = [word.chinese];
      while (options.length < 4) {
        const randomWord = vocabularyList[Math.floor(Math.random() * vocabularyList.length)].chinese;
        if (!options.includes(randomWord)) {
          options.push(randomWord);
        }
      }
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      return {
        questionText: word.english,
        options: shuffledOptions,
        correctAnswer: shuffledOptions.indexOf(word.chinese)
      };
    });

    // 生成看中拼英題目
    const chineseToEnglishQuestions = shuffledVocabulary.slice(30, 60).map(word => {
      const options = [word.english];
      while (options.length < 4) {
        const randomWord = vocabularyList[Math.floor(Math.random() * vocabularyList.length)].english;
        if (!options.includes(randomWord)) {
          options.push(randomWord);
        }
      }
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      return {
        questionText: word.chinese,
        options: shuffledOptions,
        correctAnswer: shuffledOptions.indexOf(word.english)
      };
    });

    setQuestions({
      englishToChinese: englishToChineseQuestions,
      chineseToEnglish: chineseToEnglishQuestions,
      reading: readingQuestions
    });
  };



  const handleAnswerClick = (sectionKey, questionIndex, optionIndex, readingPassageIndex = null) => {
    setSelectedOptions(prev => ({
      ...prev,
      [`${sectionKey}-${readingPassageIndex !== null ? `${readingPassageIndex}-` : ''}${questionIndex}`]: optionIndex
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    const newWrongAnswers = [];

    // 計算看英拼中和看中拼英的分數
    ['englishToChinese', 'chineseToEnglish'].forEach(section => {
      questions[section].forEach((question, index) => {
        const selectedAnswer = selectedOptions[`${section}-${index}`];
        if (selectedAnswer === question.correctAnswer) {
          totalScore += 1;
        } else {
          newWrongAnswers.push({
            question: question.questionText,
            userAnswer: question.options[selectedAnswer],
            correctAnswer: question.options[question.correctAnswer],
            origin: question.questionText // 显示原题目
          });
        }
      });
    });

    // 計算閱讀測驗的分數
    questions.reading.forEach((passage, passageIndex) => {
      passage.questions.forEach((question, questionIndex) => {
        const selectedAnswer = selectedOptions[`reading-${passageIndex}-${questionIndex}`];
        if (selectedAnswer === question.correctAnswer) {
          totalScore += 2;
        } else {
          newWrongAnswers.push({
            passage: passage.passage,
            question: question.questionText,
            userAnswer: question.options[selectedAnswer],
            correctAnswer: question.options[question.correctAnswer],
            origin: question.questionText // 显示原题目
          });
        }
      });
    });

    setScore(totalScore);
    onScoreSubmit(totalScore);
    setShowScore(true);
    setSelectedOptions({});
    generateAllQuestions();
    setWrongAnswers(newWrongAnswers);
    window.scrollTo(0, 0); // 新增這行，提交後自動回到頂部
  };

  const restartQuiz = () => {
    setScore(0);
    setShowScore(false);
    setSelectedOptions({});
    generateAllQuestions();
  };

  // 確保已添加發音功能
  const speakWord = (word, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US'; // 美式英語
    speech.text = word;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };
  
  // 在 return 部分修改顯示英文單詞的地方
  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          {/* 頂部的重新測驗按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button onClick={restartQuiz} className="submit-button">重新測驗</button>
          </div>
          <h2>測驗完成！</h2>
          <p>總得分：{score} / 100</p>
          {wrongAnswers.length > 0 && (
            <div className="wrong-answers-section">
              <h3>✏️ 需要加強的題目（{wrongAnswers.length}題）</h3>
              {wrongAnswers.map((item, index) => (
                <div key={index} className="wrong-answer-item">
                  <div className="question-header">
                    <span className="wrong-badge">❌ 錯誤</span>
                    <span className="question-number">題號 #{index + 1}</span>
                  </div>
                  {item.passage && (
                    <div className="reading-passage">
                      <pre>{item.passage}</pre>
                    </div>
                  )}
                  <div className="answer-comparison">
                    {/* 題目內容移到這裡，並靠左顯示 */}
                    {item.origin && (
                      <div className="origin-question" style={{ marginBottom: 8, color: '#0984e3', fontWeight: 600, textAlign: 'left' }}>
                        題目內容：{item.origin}
                        {/^[a-zA-Z\s]+$/.test(item.origin) && (
                          <span 
                            onClick={() => speakWord(item.origin)} 
                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                            title="點擊發音"
                          >
                            🔊
                          </span>
                        )}
                      </div>
                    )}
                    <div className="answer-row your-answer">
                      <span className="answer-label">你的答案：</span>
                      <span className="answer-content">{item.userAnswer || '未作答'}</span>
                    </div>
                    <div className="answer-row correct-answer">
                      <span className="answer-label">正確答案：</span>
                      <span className="answer-content">{item.correctAnswer}</span>
                    </div>
                  </div>
                  
                  {index < wrongAnswers.length - 1 && <hr className="divider" />}
                </div>
              ))}
            </div>
          )}
          {/* 底部的重新測驗與回到頂部按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 30 }}>
            <button onClick={restartQuiz} className="submit-button">重新測驗</button>
            <button onClick={() => window.scrollTo(0, 0)} className="submit-button" style={{ background: '#b2bec3' }}>回到頂部</button>
          </div>
        </div>
      ) : (
        <div>
          {/* 看英拼中部分 */}
          <div className="question-section">
            <h2>測驗一：看英拼中 (30題)</h2>
            {questions.englishToChinese.map((question, index) => {
              // 判斷是否已選擇
              const selected = selectedOptions[`englishToChinese-${index}`];
              const isAnswered = typeof selected !== 'undefined';
              return (
                <div key={`english-${index}`} className="question-item">
                  <div className="word-display">
                    {`${index + 1}. ${question.questionText}`}
                    <span 
                      onClick={() => speakWord(question.questionText)} 
                      style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '0.8em' }}
                      title="點擊發音"
                    >
                      🔊
                    </span>
                  </div>
                  <div className="answer-options compact-options">
                    {question.options.map((option, optionIndex) => {
                      // 判斷正確與錯誤
                      let optionClass = "option-label";
                      if (isAnswered) {
                        if (optionIndex === question.correctAnswer) {
                          optionClass += " option-correct";
                        } else if (optionIndex === selected) {
                          optionClass += " option-wrong";
                        }
                      }
                      return (
                        <label key={optionIndex} className={optionClass}>
                          <input
                            type="radio"
                            name={`english-${index}`}
                            checked={selected === optionIndex}
                            onChange={() => handleAnswerClick('englishToChinese', index, optionIndex)}
                            disabled={isAnswered}
                          />
                          <span className="radio-custom"></span>
                          <span className="option-text">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 看中拼英部分 */}
          <div className="question-section">
            <h2>測驗二：看中拼英 (30題)</h2>
            {questions.chineseToEnglish.map((question, index) => {
              const selected = selectedOptions[`chineseToEnglish-${index}`];
              const isAnswered = typeof selected !== 'undefined';
              return (
                <div key={`chinese-${index}`} className="question-item">
                  <div className="word-display">{`${index + 1}. ${question.questionText}`}</div>
                  <div className="answer-options compact-options">
                    {question.options.map((option, optionIndex) => {
                      let optionClass = "option-label";
                      if (isAnswered) {
                        if (optionIndex === question.correctAnswer) {
                          optionClass += " option-correct";
                        } else if (optionIndex === selected) {
                          optionClass += " option-wrong";
                        }
                      }
                      return (
                        <label key={optionIndex} className={optionClass}>
                          <input
                            type="radio"
                            name={`chinese-${index}`}
                            checked={selected === optionIndex}
                            onChange={() => handleAnswerClick('chineseToEnglish', index, optionIndex)}
                            disabled={isAnswered}
                          />
                          <span className="radio-custom"></span>
                          <span className="option-text">
                            {option}
                            <span 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                speakWord(option);
                              }} 
                              style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '0.8em' }}
                              title="點擊發音"
                            >
                              🔊
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 閱讀測驗部分 */}
          <div className="question-section">
            <h2 style={{ fontSize: '26px', color: '#2c3e50' }}>
              <span style={{ color: '#3498db', marginRight: '10px' }}>✧</span>
              測驗三：閱讀測驗
            </h2>
            {questions.reading.map((passage, passageIndex) => (
              <div key={`reading-${passageIndex}`} className="reading-block">
                <div className="reading-passage" style={{ position: 'relative' }}>
                  <pre style={{ marginBottom: 0 }}>{passage.passage}</pre>
                  {/* passage 發音按鈕 */}
                  <span
                    onClick={() => speakWord(passage.passage)}
                    className="speaker-icon"
                    title="朗讀全文"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 18,
                      fontSize: '1.3em',
                      color: '#0984e3',
                      cursor: 'pointer',
                      background: '#f0f9ff',
                      borderRadius: '50%',
                      padding: '4px 8px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    🔊
                  </span>
                </div>
                {passage.questions.map((question, questionIndex) => {
                  const selected = selectedOptions[`reading-${passageIndex}-${questionIndex}`];
                  const isAnswered = typeof selected !== 'undefined';
                  const isEnglishQuestion = /^[a-zA-Z\s?.,'":;!-]+$/.test(question.questionText);
                  
                  return (
                    <div key={`reading-${passageIndex}-${questionIndex}`} className="question-item">
                      <div className="word-display">
                        {question.questionText}
                        {isEnglishQuestion && (
                          <span
                            onClick={(e) => speakWord(question.questionText, e)}
                            className="speaker-icon"
                            title="點擊發音"
                            style={{ marginLeft: 8 }}
                          >
                            🔊
                          </span>
                        )}
                      </div>
                      <div className="answer-options">
                        {question.options.map((option, optionIndex) => {
                          let optionClass = "option-label";
                          if (isAnswered) {
                            if (optionIndex === question.correctAnswer) {
                              optionClass += " option-correct";
                            } else if (optionIndex === selected) {
                              optionClass += " option-wrong";
                            }
                          }
                          
                          const isEnglishOption = /^[a-zA-Z\s?.,'":;!-]+$/.test(option);
                          
                          return (
                            <label key={optionIndex} className={optionClass}>
                              <input
                                type="radio"
                                name={`reading-${passageIndex}-${questionIndex}`}
                                checked={selected === optionIndex}
                                onChange={() => handleAnswerClick('reading', questionIndex, optionIndex, passageIndex)}
                                disabled={isAnswered}
                              />
                              <span className="radio-custom"></span>
                              <span className="option-text">
                                {option}
                                {isEnglishOption && (
                                  <span
                                    onClick={(e) => speakWord(option, e)}
                                    className="speaker-icon"
                                    title="點擊發音"
                                    style={{ marginLeft: 8 }}
                                  >
                                    🔊
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <button 
            onClick={handleSubmit} 
            className="submit-button"
            disabled={Object.keys(selectedOptions).length === 0}
          >
            提交測驗
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;