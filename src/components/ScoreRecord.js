function ScoreRecord({ scores }) {
  const averageScore = scores.length > 0 
    ? (scores.reduce((acc, curr) => acc + curr, 0) / scores.length).toFixed(1)
    : 0;

  return (
    <div className="score-record">
      <div className="score-summary">
        <h3>測驗記錄</h3>
        <p>平均分數: {averageScore}</p>
        <p>總測驗次數: {scores.length}</p>
      </div>
      <div className="score-history">
        <h4>歷史記錄</h4>
        <ul>
          {scores.map((score, index) => (
            <li key={index}>
              測驗 {index + 1}: {score}分
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Add this export statement
export default ScoreRecord;