// App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Quiz from './components/Quiz';
import Home from './components/Home';
import ThemeToggle from './components/ThemeToggle';


const App = () => {
  return (
    <div>
      <ThemeToggle />
      <div className="quiz-container">
        <Sidebar />
        <div className="quiz-questions">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:quiz" element={<Quiz />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


export default App;
