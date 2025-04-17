import { useState } from 'react';
import Quiz from './components/Quiz';
import ScoreRecord from './components/ScoreRecord';

function App() {
  const [scores, setScores] = useState([]); // 改為存儲所有成績的數組

  const handleScoreSubmit = (newScore) => {
    // 更新成績列表
    setScores(prev => [...prev, newScore]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>英語測驗系統</h1>
      </header>
      <main>
        <Quiz onScoreSubmit={handleScoreSubmit} />
        <ScoreRecord scores={scores} /> {/* 傳遞成績數據 */}
      </main>
    </div>
  );
}

export default App;