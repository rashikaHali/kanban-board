import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Board from './pages/Board/Board';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Board />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
